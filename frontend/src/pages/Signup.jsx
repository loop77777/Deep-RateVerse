import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useSnackbar } from 'notistack';

/**
 * Signup Page Component
 */
export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (formData.name.length < 20 || formData.name.length > 60) {
                const msg = "Name must be between 20-60 characters";
                setError(msg);
                enqueueSnackbar(msg, { variant: 'warning' });
                setLoading(false);
                return;
            }

            if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(formData.password)) {
                const msg = "Password must have uppercase + special char (8-16 chars)";
                setError(msg);
                enqueueSnackbar(msg, { variant: 'warning' });
                setLoading(false);
                return;
            }

            const response = await api.post("/auth/signup", formData);

            if (response.success) {
                enqueueSnackbar("Account created! Please login.", { variant: 'success' });
                setTimeout(() => navigate("/"), 1500);
            } else {
                const msg = response.msg || "Signup failed";
                setError(msg);
                enqueueSnackbar(msg, { variant: 'error' });
            }
        } catch (err) {
            const msg = err.msg || "Error creating account";
            setError(msg);
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const roleDescriptions = {
        user: "View and rate stores",
        owner: "Manage your store and view ratings",
        admin: "Manage users, stores and platform"
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Name (20-60 characters)
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Example: This Is A Valid User Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-gray-500 text-xs mt-1">
                            {formData.name.length}/60 characters
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Must have uppercase + special char"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-gray-500 text-xs mt-1">Example: Test@123</p>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Your address"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Select Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User - Rate Stores</option>
                            <option value="owner">Owner - Manage Store</option>
                            <option value="admin">Admin - Manage Platform</option>
                        </select>
                        <p className="text-gray-500 text-xs mt-1">
                            {roleDescriptions[formData.role]}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have account?
                    <Link to="/" className="text-blue-600 hover:underline ml-1 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}