import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

/**
 * Login Page Component
 * Authenticates user and stores token + user data
 */
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Call API
            const response = await api.post("/auth/login", { email, password });

            console.log("Login response:", response);

            // Check if login was successful
            if (response.success && response.token) {
                // Store token and user data
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));

                console.log("✅ Login successful, user role:", response.user.role);

                // Navigate based on role
                if (response.user.role === "admin") {
                    navigate("/admin");
                } else if (response.user.role === "owner") {
                    navigate("/owner");
                } else {
                    navigate("/stores");
                }
            } else {
                setError(response.msg || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.msg || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">RateVerse</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Don't have account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}