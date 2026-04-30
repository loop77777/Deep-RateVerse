// filepath: c:\Users\ASUS\Documents\deep assignments\roxiler system assignment\frontend\src\pages\Settings.jsx
import { getUser } from "../utils/auth";
import { useState } from "react";
import api from "../utils/api";
import Layout from "../components/Layout";
import { useSnackbar } from 'notistack';

/**
 * Settings Page Component
 * User settings
 */
export default function Settings() {
    const user = getUser();
    const { enqueueSnackbar } = useSnackbar();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (passwords.newPassword !== passwords.confirmPassword) {
                setMessage("New passwords do not match");
                enqueueSnackbar("New passwords do not match", { variant: 'warning' });
                setLoading(false);
                return;
            }

            if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(passwords.newPassword)) {
                setMessage("Password must have uppercase + special char (8-16 chars)");
                enqueueSnackbar("Password must have uppercase + special char", { variant: 'warning' });
                setLoading(false);
                return;
            }

            const response = await api.put("/user/password", {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });

            if (response.success) {
                setMessage("Password updated successfully");
                enqueueSnackbar("Password updated successfully!", { variant: 'success' });
                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setShowPasswordForm(false);
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(response.msg || "Failed to update password");
                enqueueSnackbar(response.msg || "Failed to update password", { variant: 'error' });
            }
        } catch (err) {
            setMessage(err.msg || "Error updating password");
            enqueueSnackbar(err.msg || "Error updating password", { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-8">Settings</h1>

                {/* User Information */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-600 text-sm">Name</p>
                            <p className="text-xl font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Email</p>
                            <p className="text-xl font-semibold">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Role</p>
                            <span className={`inline-block px-3 py-1 rounded text-white text-sm font-bold ${
                                user.role === 'admin' ? 'bg-red-600' :
                                user.role === 'owner' ? 'bg-green-600' :
                                'bg-blue-600'
                            }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Password Change */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4">Security</h2>
                    
                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.oldPassword}
                                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    placeholder="Must have uppercase + special char"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <p className="text-gray-500 text-xs mt-1">Example: Test@123</p>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${
                                    message.includes("success") ? "bg-green-100 text-green-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
                                        setMessage("");
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}
