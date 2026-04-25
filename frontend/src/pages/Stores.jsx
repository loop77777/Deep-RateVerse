import { useEffect, useState } from "react";
import Layout from "../components/Layout";
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
            setError("");

            const res = await api.get("/stores");

            console.log("Stores API response:", res);

            // -------- HANDLE DIFFERENT RESPONSE STRUCTURES --------
            if (res.success) {
                // Response can be: res.data, res.stores, or direct array
                const storesData = res.data || res.stores || [];
                setStores(Array.isArray(storesData) ? storesData : []);
            } else {
                setError(res.msg || "Failed to load stores");
                setStores([]);
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

            const res = await api.post("/stores/rate", { store_id, rating });

            console.log("Rating response:", res);

            if (res.success) {
                alert("✅ Rating submitted successfully!");
                fetchStores(); // Refresh stores list
            } else {
                alert("❌ " + (res.msg || "Failed to submit rating"));
            }
        } catch (err) {
            console.error("Error rating store:", err);
            alert("❌ " + (err.msg || "Error submitting rating"));
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
        return (
            <Layout>
                <div className="text-center py-12">
                    <div className="inline-block animate-spin">
                        <div className="text-2xl">⏳ Loading stores...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    // -------- ERROR STATE --------
    if (error) {
        return (
            <Layout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                    <h2 className="font-bold mb-2">❌ Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={fetchStores}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    // -------- EMPTY STATE --------
    if (!stores || stores.length === 0) {
        return (
            <Layout>
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">📭 No stores available</p>
                </div>
            </Layout>
        );
    }

    // -------- RENDER STORES --------
    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-3xl font-bold mb-6">🏪 All Stores</h1>

                {/* -------- SEARCH BAR -------- */}
                <input
                    placeholder="🔍 Search by store name or address..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border-2 border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:border-blue-500"
                />

                {/* -------- FILTERED RESULTS COUNT -------- */}
                <p className="mb-4 text-gray-600">
                    Showing {filtered.length} of {stores.length} stores
                </p>

                {/* -------- STORES GRID -------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(store => (
                        <div
                            key={store.id}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
                        >
                            {/* Store Info */}
                            <h3 className="text-xl font-bold mb-2">{store.name}</h3>
                            <p className="text-gray-600 mb-3">📍 {store.address}</p>

                            {/* Ratings */}
                            <div className="mb-4 bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-600">Average Rating</p>
                                <p className="text-lg font-bold text-yellow-500">
                                    ⭐ {store.avg_rating ? store.avg_rating.toFixed(1) : "Not rated"}
                                </p>
                                <p className="text-sm text-gray-600">Your Rating</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {store.user_rating ? `${store.user_rating}⭐` : "Not rated"}
                                </p>
                            </div>

                            {/* Rating Buttons */}
                            <div className="flex gap-2 mt-4">
                                {[1, 2, 3, 4, 5].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => rate(store.id, r)}
                                        disabled={ratingLoading === store.id}
                                        className={`px-3 py-2 rounded font-bold transition ${
                                            ratingLoading === store.id
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-black text-white hover:bg-gray-800"
                                        }`}
                                    >
                                        {ratingLoading === store.id ? "⏳" : `${r}⭐`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* -------- NO SEARCH RESULTS -------- */}
                {filtered.length === 0 && search && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No stores match your search: "{search}"</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}