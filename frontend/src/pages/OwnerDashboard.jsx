import { useEffect, useState } from "react";
import api from "../utils/api";

export default function OwnerDashboard() {
    const [data, setData] = useState({ users: [] });

    useEffect(() => {
        api.get("/owner/dashboard").then(res => setData(res.data));
    }, []);

    return (
        <div>
            <h2>Owner Dashboard</h2>

            <p>Average Rating: {data.avg_rating}</p>

            {data.users.map((u, i) => (
                <div key={i}>
                    {u.name} - ⭐ {u.rating}
                </div>
            ))}
        </div>
    );
}