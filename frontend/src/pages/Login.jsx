import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);

            const res = await api.post("/login", form);

            console.log("LOGIN RESPONSE:", res.data); // DEBUG

            localStorage.setItem("token", res.data.token);

            // decode role
            const payload = JSON.parse(atob(res.data.token.split(".")[1]));

            // redirect based on role
            if (payload.role === "admin") {
                window.location.href = "/admin";
            } else if (payload.role === "owner") {
                window.location.href = "/owner";
            } else {
                window.location.href = "/stores";
            }

        } catch (err) {
            console.error(err);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">

            <div className="bg-white p-6 rounded shadow w-80">
                <h2 className="text-xl mb-4 text-center">RateVerse Login</h2>

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Email"
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />

                <input
                    className="border p-2 w-full mb-4"
                    type="password"
                    placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <button
                    className="bg-black text-white w-full p-2 mb-2"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Signup link */}
                <p className="text-sm text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-500">Signup</Link>
                </p>
            </div>

        </div>
    );
}