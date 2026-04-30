import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

/**
 * Owner Dashboard
 * View ratings received for owner's store
 */
export default function OwnerDashboard() {
    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/owner/dashboard");

            if (res.success) {
                setStore(res.store);
                setRatings(res.ratings || []);
                setAverageRating(res.averageRating || 0);
            } else {
                setError(res.msg || "Failed to load dashboard");
            }
        } catch (err) {
            setError(err.msg || "Failed to load owner dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-12">Loading your store dashboard...</div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                    <p>{error}</p>
                    <button
                        onClick={loadDashboard}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    if (!store) {
        return (
            <Layout>
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">You don't have a store yet</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">📈 Your Store Dashboard</h1>

                {/* -------- STORE INFO -------- */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-3xl font-bold mb-4">{store.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-600">Email</p>
                            <p className="text-xl font-bold">{store.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Address</p>
                            <p className="text-xl font-bold">{store.address}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <p className="text-gray-600 font-bold">Average Rating</p>
                            <p className="text-4xl font-bold text-yellow-600">
                                ⭐ {averageRating ? averageRating.toFixed(1) : "No ratings yet"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* -------- RATINGS LIST -------- */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">⭐ Customer Ratings ({ratings.length})</h2>

                    {ratings.length === 0 ? (
                        <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                            <p>No ratings yet. Your store is waiting for customer feedback!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ratings.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-lg">{rating.name}</p>
                                            <p className="text-gray-600 text-sm">{rating.email}</p>
                                        </div>
                                        <p className="text-2xl font-bold text-yellow-500">
                                            {'⭐'.repeat(rating.rating)}
                                        </p>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Rated on {new Date(rating.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
