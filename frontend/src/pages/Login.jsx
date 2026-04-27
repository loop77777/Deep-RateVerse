import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useSnackbar } from 'notistack';

/**
 * Login Page Component
 */
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });

            if (response.success && response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));

                enqueueSnackbar("Login successful!", { variant: 'success' });

                // Navigate after brief delay so user sees notification
                setTimeout(() => {
                    if (response.user.role === "admin") {
                        navigate("/admin");
                    } else if (response.user.role === "owner") {
                        navigate("/owner");
                    } else {
                        navigate("/stores");
                    }
                }, 500);
            } else {
                const errorMsg = response.msg || "Login failed";
                setError(errorMsg);
                enqueueSnackbar(errorMsg, { variant: 'error' });
            }
        } catch (err) {
            const errorMsg = err.msg || "Invalid email or password";
            setError(errorMsg);
            enqueueSnackbar(errorMsg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-8">
                <h1 className="text-4xl font-bold mb-8 text-center">RateVerse</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <hr className="my-6" />

                <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
                    <p className="text-sm font-bold text-gray-700 mb-4">
                        Test Credentials
                    </p>
                    <div className="space-y-3 text-xs text-gray-600">
                        <div className="bg-white p-3 rounded">
                            <p className="font-bold text-blue-600 mb-1">User:</p>
                            <p>user@test.com / Test@123</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                            <p className="font-bold text-blue-600 mb-1">Admin:</p>
                            <p>admin@test.com / Test@123</p>
                            <p>deepadmin@test.com / Test@123</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                            <p className="font-bold text-blue-600 mb-1">Owner:</p>
                            <p>owner@test.com / Test@123</p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-600">
                    Don't have account?
                    <Link to="/signup" className="text-blue-600 hover:underline ml-1 font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
