import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProtectedRoute({ children, roles }) {
    const user = getUser();

    if (!user) {
        console.log("No user, redirecting to login");
        return <Navigate to="/" />;
    }

    if (roles && !roles.includes(user.role)) {
        console.log("User role not allowed:", user.role);
        return <Navigate to="/stores" />;
    }

    return children;
}