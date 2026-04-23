import { useState } from "react";
import api from "../utils/api";

export default function Signup() {
    const [form, setForm] = useState({});

    const handleSignup = async () => {
        await api.post("/signup", form);
        alert("Signup success");
    };

    return (
        <div>
            <h2>Signup</h2>

            <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Address" onChange={e => setForm({ ...form, address: e.target.value })} />
            <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />

            <button onClick={handleSignup}>Signup</button>
        </div>
    );
}