import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminDashboard() {
    const [data, setData] = useState({});

    useEffect(() => {
        api.get("/admin/dashboard").then(res => setData(res.data));
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Total Users: {data.users}</p>
            <p>Total Stores: {data.stores}</p>
            <p>Total Ratings: {data.ratings}</p>
        </div>
    );
}