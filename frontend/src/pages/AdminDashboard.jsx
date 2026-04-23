// pages/AdminDashboard.jsx
import Layout from "../components/Layout";

export default function AdminDashboard() {
    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white p-5 rounded-xl shadow">
                    <h3>Total Users</h3>
                    <p className="text-2xl font-bold">120</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <h3>Total Stores</h3>
                    <p className="text-2xl font-bold">45</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <h3>Total Ratings</h3>
                    <p className="text-2xl font-bold">320</p>
                </div>

            </div>
        </Layout>
    );
}