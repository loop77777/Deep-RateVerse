// pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

/**
 * Admin Dashboard
 * Manage users, stores, and view statistics
 */
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // -------- NEW USER FORM --------
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });

    // -------- NEW STORE FORM --------
    const [newStore, setNewStore] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/dashboard");
            if (res.success) {
                setStats(res.stats);
            }
        } catch (err) {
            setError(err.msg || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            let url = "/admin/users";
            const params = [];
            if (search) params.push(`search=${search}`);
            if (roleFilter) params.push(`role=${roleFilter}`);
            if (params.length) url += "?" + params.join("&");

            const res = await api.get(url);
            if (res.success) {
                setUsers(res.data || []);
            }
        } catch (err) {
            setError(err.msg || "Failed to load users");
        }
    };

    const loadStores = async () => {
        try {
            let url = "/admin/stores";
            if (search) url += `?search=${search}`;

            const res = await api.get(url);
            if (res.success) {
                setStores(res.data || []);
            }
        } catch (err) {
            setError(err.msg || "Failed to load stores");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            if (newUser.name.length < 20 || newUser.name.length > 60) {
                alert("Name must be 20-60 characters");
                return;
            }

            const res = await api.post("/admin/user", newUser);
            if (res.success) {
                alert("✅ User created successfully!");
                setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
                loadUsers();
            } else {
                alert("❌ " + (res.msg || "Failed to create user"));
            }
        } catch (err) {
            alert("❌ " + (err.msg || "Error creating user"));
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/admin/store", newStore);
            if (res.success) {
                alert("✅ Store created successfully!");
                setNewStore({ name: "", email: "", address: "", owner_id: "" });
                loadStores();
            } else {
                alert("❌ " + (res.msg || "Failed to create store"));
            }
        } catch (err) {
            alert("❌ " + (err.msg || "Error creating store"));
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-12">Loading admin dashboard...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">📊 Admin Dashboard</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* -------- TAB NAVIGATION -------- */}
                <div className="flex gap-4 mb-6 border-b-2">
                    {["dashboard", "users", "stores"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                if (tab === "users") loadUsers();
                                if (tab === "stores") loadStores();
                            }}
                            className={`px-6 py-3 font-bold transition ${activeTab === tab
                                    ? "border-b-4 border-blue-600 text-blue-600"
                                    : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* -------- DASHBOARD TAB -------- */}
                {activeTab === "dashboard" && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-100 p-6 rounded-lg shadow">
                            <h3 className="text-gray-600 font-bold">Total Users</h3>
                            <p className="text-4xl font-bold text-blue-600">{stats.users}</p>
                        </div>
                        <div className="bg-green-100 p-6 rounded-lg shadow">
                            <h3 className="text-gray-600 font-bold">Total Stores</h3>
                            <p className="text-4xl font-bold text-green-600">{stats.stores}</p>
                        </div>
                        <div className="bg-yellow-100 p-6 rounded-lg shadow">
                            <h3 className="text-gray-600 font-bold">Total Ratings</h3>
                            <p className="text-4xl font-bold text-yellow-600">{stats.ratings}</p>
                        </div>
                    </div>
                )}

                {/* -------- USERS TAB -------- */}
                {activeTab === "users" && (
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-2xl font-bold mb-4">➕ Add New User</h2>
                            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Name (20-60 chars)"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={newUser.address}
                                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                >
                                    <option value="user">User</option>
                                    <option value="owner">Owner</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Create User
                                </button>
                            </form>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">👥 Users List</h2>
                            <div className="flex gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border px-4 py-2 rounded flex-1"
                                />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="border px-4 py-2 rounded"
                                >
                                    <option value="">All Roles</option>
                                    <option value="user">User</option>
                                    <option value="owner">Owner</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    onClick={loadUsers}
                                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    Search
                                </button>
                            </div>

                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="w-full">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">Address</th>
                                            <th className="px-4 py-2 text-left">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">{user.name}</td>
                                                <td className="px-4 py-2">{user.email}</td>
                                                <td className="px-4 py-2">{user.address}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded text-white text-sm font-bold ${user.role === 'admin' ? 'bg-red-600' :
                                                            user.role === 'owner' ? 'bg-green-600' :
                                                                'bg-blue-600'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* -------- STORES TAB -------- */}
                {activeTab === "stores" && (
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-2xl font-bold mb-4">➕ Add New Store</h2>
                            <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Store Name"
                                    value={newStore.name}
                                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Store Email"
                                    value={newStore.email}
                                    onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={newStore.address}
                                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Owner ID"
                                    value={newStore.owner_id}
                                    onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
                                    className="border px-4 py-2 rounded"
                                    required
                                />
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-2">
                                    Create Store
                                </button>
                            </form>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">🏪 Stores List</h2>
                            <input
                                type="text"
                                placeholder="Search stores..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border px-4 py-2 rounded w-full mb-4"
                            />
                            <button
                                onClick={loadStores}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
                            >
                                Search
                            </button>

                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="w-full">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">Address</th>
                                            <th className="px-4 py-2 text-left">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stores.map(store => (
                                            <tr key={store.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">{store.name}</td>
                                                <td className="px-4 py-2">{store.email}</td>
                                                <td className="px-4 py-2">{store.address}</td>
                                                <td className="px-4 py-2">⭐ {store.rating ? store.rating.toFixed(1) : "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}