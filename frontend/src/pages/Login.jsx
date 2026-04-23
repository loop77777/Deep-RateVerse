import { useState } from "react";
import api from "../utils/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await api.post("/login", { email, password });

        // Store token
        localStorage.setItem("token", res.data.token);

        alert("Login successful");
    };

    return (
        <div>
            <h2>Login</h2>

            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}