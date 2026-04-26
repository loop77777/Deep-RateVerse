import { useState, useEffect } from "react";
import api from "../utils/api";

/**
 * Stores Page Component
 * Displays all stores with search and rating functionality
 */
export default function Stores() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ratingLoading, setRatingLoading] = useState(null);

    // -------- FETCH STORES ON MOUNT --------
    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await api.get("/stores");

            console.log("Stores response:", response);

            if (response.success && Array.isArray(response.data)) {
                setStores(response.data);
            } else if (response.success && Array.isArray(response.stores)) {
                setStores(response.stores);
            } else {
                setStores([]);
                setError(response.msg || "No stores found");
            }
        } catch (err) {
            console.error("Error fetching stores:", err);
            setError(err.msg || "Failed to fetch stores");
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    // -------- RATE STORE FUNCTION --------
    const rate = async (store_id, rating) => {
        try {
            setRatingLoading(store_id);
            const response = await api.post("/stores/rate", {
                storeId: store_id,
                rating
            });

            if (response.success) {
                alert("Rating submitted successfully");
                fetchStores();
            } else {
                alert(response.msg || "Failed to rate store");
            }
        } catch (err) {
            alert(err.msg || "Error rating store");
        } finally {
            setRatingLoading(null);
        }
    };

    // -------- FILTER STORES BY SEARCH --------
    const filtered = stores.filter(s =>
        (s.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (s.address?.toLowerCase().includes(search.toLowerCase()) || false)
    );

    // -------- LOADING STATE --------
    if (loading) {
        return <div className="text-center py-8">Loading stores...</div>;
    }

    // -------- ERROR STATE --------
    if (error) {
        return <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>;
    }

    // -------- EMPTY STATE --------
    if (!stores || stores.length === 0) {
        return <div className="text-center py-8">No stores available</div>;
    }

    // -------- RENDER STORES --------
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">All Stores</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search stores by name or address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>

            {filtered.length === 0 && (
                <div className="text-center text-gray-500">No stores match your search</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((store) => (
                    <div key={store.id} className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-2">{store.name}</h2>
                        <p className="text-gray-600 mb-2">{store.address}</p>
                        <p className="text-yellow-500 font-bold mb-4">
                            Rating: {store.rating || "Not rated yet"}
                        </p>

                        <div className="flex gap-2 flex-wrap">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => rate(store.id, rating)}
                                    disabled={ratingLoading === store.id}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}