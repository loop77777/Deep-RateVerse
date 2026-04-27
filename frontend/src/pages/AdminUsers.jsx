import { useState, useEffect } from "react";
import api from "../utils/api";
import Layout from "../components/Layout";
import { useSnackbar } from 'notistack';

/**
 * Admin Users Management Page
 */
export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });
    const [submitting, setSubmitting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/users");
            
            if (response.success) {
                setUsers(response.data || []);
            } else {
                enqueueSnackbar(response.msg || "Failed to load users", { variant: 'error' });
            }
        } catch (err) {
            enqueueSnackbar("Error loading users", { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearch(query);

        if (!query.trim()) {
            loadUsers();
            return;
        }

        try {
            const response = await api.get(`/admin/users/search?q=${query}`);
            if (response.success) {
                setUsers(response.data || []);
            }
        } catch (err) {
            enqueueSnackbar("Search failed", { variant: 'error' });
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (formData.name.length < 20 || formData.name.length > 60) {
                enqueueSnackbar("Name must be 20-60 characters", { variant: 'warning' });
                setSubmitting(false);
                return;
            }

            if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(formData.password)) {
                enqueueSnackbar("Password must have uppercase + special char", { variant: 'warning' });
                setSubmitting(false);
                return;
            }

            const response = await api.post("/admin/user/create", formData);

            if (response.success) {
                enqueueSnackbar("User created successfully!", { variant: 'success' });
                loadUsers();
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    address: "",
                    role: "user"
                });
                setShowCreateForm(false);
            } else {
                enqueueSnackbar(response.msg || "Failed to create user", { variant: 'error' });
            }
        } catch (err) {
            enqueueSnackbar(err.msg || "Error creating user", { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await api.delete(`/admin/user/${userId}`);
                
                if (response.success) {
                    enqueueSnackbar("User deleted successfully!", { variant: 'success' });
                    loadUsers();
                } else {
                    enqueueSnackbar(response.msg || "Failed to delete user", { variant: 'error' });
                }
            } catch (err) {
                enqueueSnackbar("Error deleting user", { variant: 'error' });
            }
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
                        <p className="text-gray-600">Create and manage user accounts</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        {showCreateForm ? "Cancel" : "+ Create User"}
                    </button>
                </div>

                {/* Create User Form */}
                {showCreateForm && (
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Full name (20-60 chars)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.name.length}/60</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="Test@123"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Uppercase + Special char (8-16)</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="owner">Owner</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    placeholder="Full address"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows="2"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
                            >
                                {submitting ? "Creating..." : "Create User"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Search Bar */}
                <div>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Users Table */}
                {users.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left font-bold">Name</th>
                                    <th className="px-6 py-3 text-left font-bold">Email</th>
                                    <th className="px-6 py-3 text-left font-bold">Address</th>
                                    <th className="px-6 py-3 text-left font-bold">Role</th>
                                    <th className="px-6 py-3 text-center font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-3 font-semibold">{user.name}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{user.address}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-3 py-1 rounded text-white text-xs font-bold ${
                                                user.role === 'admin' ? 'bg-red-600' :
                                                user.role === 'owner' ? 'bg-green-600' :
                                                'bg-blue-600'
                                            }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No users found</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}