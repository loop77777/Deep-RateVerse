import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function Navbar() {
    const user = getUser();

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="bg-black text-white p-4 flex justify-between">

            <h2 className="font-bold">RateVerse</h2>

            <div className="space-x-4">
                <Link to="/stores">Stores</Link>

                {user?.role === "admin" && <Link to="/admin">Admin</Link>}
                {user?.role === "owner" && <Link to="/owner">Owner</Link>}

                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}