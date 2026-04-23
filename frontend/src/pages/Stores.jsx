import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Stores() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.get("/stores").then(res => setStores(res.data));
    }, []);

    const rate = async (store_id, rating) => {
        await api.post("/rate", { store_id, rating });
        window.location.reload();
    };

    const filtered = stores.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <h1 className="text-2xl mb-4">Stores</h1>

            <input
                placeholder="Search store..."
                className="border p-2 mb-4 w-full"
                onChange={e => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-4">
                {filtered.map(store => (
                    <div key={store.id} className="bg-white p-4 rounded shadow">

                        <h3 className="font-bold">{store.name}</h3>
                        <p>{store.address}</p>

                        <p>Average: {store.avg_rating}</p>
                        <p>Your Rating: {store.user_rating || "None"}</p>

                        <div className="flex gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map(r => (
                                <button
                                    key={r}
                                    className="bg-black text-white px-2"
                                    onClick={() => rate(store.id, r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </Layout>
    );
}