import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Stores() {
    const [stores, setStores] = useState([]);

    // Fetch stores on load
    useEffect(() => {
        api.get("/stores").then((res) => setStores(res.data));
    }, []);

    // Submit rating
    const rate = async (store_id, rating) => {
        await api.post("/rate", { store_id, rating });
        alert("Rated!");
    };

    return (
        <div>
            <h2>Stores</h2>

            {stores.map((store) => (
                <div key={store.id}>
                    <h3>{store.name}</h3>
                    <p>{store.address}</p>

                    {/* Show average rating */}
                    <p>⭐ Avg: {store.avg_rating}</p>

                    {/* Show user rating */}
                    <p>Your Rating: {store.user_rating || "Not rated"}</p>

                    {/* Rating buttons */}
                    {[1, 2, 3, 4, 5].map((r) => (
                        <button key={r} onClick={() => rate(store.id, r)}>
                            {r}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}