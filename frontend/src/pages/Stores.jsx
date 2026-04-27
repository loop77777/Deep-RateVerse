import { useState, useEffect } from "react";
import api from "../utils/api";
import { useSnackbar } from 'notistack';
import Layout from "../components/Layout";

/**
 * Stores Page - View all stores and submit/modify ratings
 */
export default function Stores() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [ratingStore, setRatingStore] = useState(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [submittingRating, setSubmittingRating] = useState(false);
    const [userRatings, setUserRatings] = useState({});
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            setLoading(true);
            console.log("Loading stores...");
            
            const response = await api.get("/store/all");
            console.log("Stores response:", response);
            
            if (response.success) {
                setStores(response.data || []);
                
                // Load user ratings for each store
                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach(store => {
                        loadUserRating(store.id);
                    });
                }
            } else {
                enqueueSnackbar(response.msg || "Failed to load stores", { variant: 'error' });
            }
        } catch (err) {
            console.error("Error loading stores:", err);
            enqueueSnackbar(err.msg || "Error loading stores", { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const loadUserRating = async (storeId) => {
        try {
            const response = await api.get(`/rating/user/${storeId}`);
            if (response.success && response.data) {
                setUserRatings(prev => ({
                    ...prev,
                    [storeId]: response.data
                }));
            }
        } catch (err) {
            // User hasn't rated this store yet - this is normal
            console.log(`No rating found for store ${storeId}`);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearch(query);

        if (!query.trim()) {
            loadStores();
            return;
        }

        try {
            console.log("Searching stores with query:", query);
            const response = await api.get(`/store/search?q=${query}`);
            console.log("Search response:", response);
            
            if (response.success) {
                setStores(response.data || []);
            } else {
                enqueueSnackbar("Search failed", { variant: 'error' });
            }
        } catch (err) {
            console.error("Search error:", err);
            enqueueSnackbar("Search error", { variant: 'error' });
        }
    };

    const handleSubmitRating = async (storeId) => {
        if (ratingValue === 0) {
            enqueueSnackbar("Please select a rating", { variant: 'warning' });
            return;
        }

        try {
            setSubmittingRating(true);
            console.log("Submitting rating:", { storeId, ratingValue });
            
            const response = await api.post("/rating/submit", {
                store_id: storeId,
                rating: ratingValue
            });

            console.log("Rating response:", response);

            if (response.success) {
                enqueueSnackbar("Rating submitted successfully!", { variant: 'success' });
                loadStores();
                setRatingStore(null);
                setRatingValue(0);
            } else {
                enqueueSnackbar(response.msg || "Failed to submit rating", { variant: 'error' });
            }
        } catch (err) {
            console.error("Error submitting rating:", err);
            enqueueSnackbar(err.msg || "Error submitting rating", { variant: 'error' });
        } finally {
            setSubmittingRating(false);
        }
    };

    const handleUpdateRating = async (storeId, ratingId) => {
        if (ratingValue === 0) {
            enqueueSnackbar("Please select a rating", { variant: 'warning' });
            return;
        }

        try {
            setSubmittingRating(true);
            console.log("Updating rating:", { ratingId, ratingValue });
            
            const response = await api.put(`/rating/${ratingId}`, {
                rating: ratingValue
            });

            console.log("Update response:", response);

            if (response.success) {
                enqueueSnackbar("Rating updated successfully!", { variant: 'success' });
                loadStores();
                setRatingStore(null);
                setRatingValue(0);
            } else {
                enqueueSnackbar(response.msg || "Failed to update rating", { variant: 'error' });
            }
        } catch (err) {
            console.error("Error updating rating:", err);
            enqueueSnackbar(err.msg || "Error updating rating", { variant: 'error' });
        } finally {
            setSubmittingRating(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading stores...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">All Stores</h1>
                    <p className="text-gray-600">Browse and rate your favorite stores</p>
                </div>

                {/* Search Bar */}
                <div>
                    <input
                        type="text"
                        placeholder="Search by store name or address..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Stores Grid */}
                {stores && stores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map(store => {
                            const userRating = userRatings[store.id];
                            // Safely convert to number
                            const avgRating = Number(store.average_rating) || 0;
                            
                            return (
                                <div key={store.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
                                        <p className="text-sm text-gray-600 mt-1">{store.email}</p>
                                        <p className="text-sm text-gray-600">{store.address}</p>
                                    </div>

                                    {/* Store Rating Display */}
                                    <div className="mb-4 p-3 bg-gray-50 rounded">
                                        <p className="text-xs text-gray-600 mb-2">Store Rating:</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} className="text-yellow-400 text-lg">
                                                        {star <= Math.round(avgRating) ? "★" : "☆"}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="font-bold text-gray-900">
                                                {avgRating > 0 ? avgRating.toFixed(1) : "No ratings"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* User's Rating Display */}
                                    {userRating && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                                            <p className="text-xs text-gray-600 mb-2">Your Rating:</p>
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} className="text-blue-400 text-lg">
                                                        {star <= userRating.rating ? "★" : "☆"}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rating Modal */}
                                    {ratingStore === store.id ? (
                                        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm font-semibold">
                                                {userRating ? "Modify your rating:" : "Rate this store:"}
                                            </p>
                                            
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRatingValue(star)}
                                                        className={`text-2xl transition ${
                                                            star <= ratingValue 
                                                                ? "text-yellow-400 scale-110" 
                                                                : "text-gray-300 hover:text-yellow-300"
                                                        }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>

                                            {ratingValue > 0 && (
                                                <p className="text-xs text-gray-600">
                                                    You selected {ratingValue} star{ratingValue !== 1 ? "s" : ""}
                                                </p>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => {
                                                        if (userRating) {
                                                            handleUpdateRating(store.id, userRating.id);
                                                        } else {
                                                            handleSubmitRating(store.id);
                                                        }
                                                    }}
                                                    disabled={submittingRating}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded font-semibold transition"
                                                >
                                                    {submittingRating ? "Submitting..." : userRating ? "Update" : "Submit"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRatingStore(null);
                                                        setRatingValue(0);
                                                    }}
                                                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-semibold transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setRatingStore(store.id);
                                                if (userRating) {
                                                    setRatingValue(userRating.rating);
                                                }
                                            }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                                        >
                                            {userRating ? "Modify Rating" : "Rate Store"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No stores found</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
