import { useState } from "react";
import api from "../utils/api";

export default function Signup() {
    const [form, setForm] = useState({});

    const handleSignup = async () => {
        await api.post("/signup", form);
        alert("Signup successful");
    };

    return (
        <div className="flex justify-center mt-10">

            <div className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl mb-4">Signup</h2>

                {["name", "email", "address", "password"].map(field => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : "text"}
                        placeholder={field}
                        className="border p-2 w-full mb-2"
                        onChange={e => setForm({ ...form, [field]: e.target.value })}
                    />
                ))}

                <button className="bg-black text-white w-full p-2"
                    onClick={handleSignup}>
                    Signup
                </button>
            </div>

        </div>
    );
}