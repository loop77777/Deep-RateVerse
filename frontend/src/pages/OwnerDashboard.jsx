import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function OwnerDashboard() {
    const [data, setData] = useState({ users: [] });

    useEffect(() => {
        api.get("/owner/dashboard")
            .then(res => setData(res.data))
            .catch(() => setData({ avg_rating: 0, users: [] }));
    }, []);

    return (
        <Layout>
            <h1 className="text-2xl mb-4">Owner Dashboard</h1>

            <p className="mb-4">Average Rating: {data.avg_rating}</p>

            {data.users.map((u, i) => (
                <div key={i} className="bg-white p-3 mb-2 rounded shadow">
                    <p>{u.name} ({u.email})</p>
                    <p>Store: {u.store_name}</p>
                    <p>Rating: {u.rating}</p>
                </div>
            ))}
        </Layout>
    );
}