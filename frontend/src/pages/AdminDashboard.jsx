import { useCallback, useEffect, useState } from "react";
import api from "../utils/api";
import Layout from "../components/Layout";
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";

/**
 * Admin Dashboard Component
 */
export default function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            console.log("Loading admin dashboard...");
            
            const response = await api.get("/admin/dashboard");
            console.log("Dashboard response:", response);
            
            if (response.success) {
                setDashboardData({
                    totalUsers: response.data?.total_users || 0,
                    totalStores: response.data?.total_stores || 0,
                    totalRatings: response.data?.total_ratings || 0
                });
            } else {
                enqueueSnackbar(response.msg || "Failed to load dashboard", { variant: 'error' });
            }
        } catch (err) {
            console.error("Error loading dashboard:", err);
            enqueueSnackbar("Error loading dashboard", { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Users */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="text-center">
                            <p className="text-gray-600 text-sm mb-2">Total Users</p>
                            <p className="text-4xl font-bold text-blue-600">{dashboardData.totalUsers}</p>
                        </div>
                    </div>

                    {/* Total Stores */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="text-center">
                            <p className="text-gray-600 text-sm mb-2">Total Stores</p>
                            <p className="text-4xl font-bold text-green-600">{dashboardData.totalStores}</p>
                        </div>
                    </div>

                    {/* Total Ratings */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="text-center">
                            <p className="text-gray-600 text-sm mb-2">Total Ratings</p>
                            <p className="text-4xl font-bold text-yellow-600">{dashboardData.totalRatings}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg font-semibold transition text-center"
                    >
                        Manage Users
                    </button>
                    <button
                        onClick={() => navigate("/stores")}
                        className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg font-semibold transition text-center"
                    >
                        View Stores
                    </button>
                </div>
            </div>
        </Layout>
    );
}
