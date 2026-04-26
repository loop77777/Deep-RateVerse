import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

/**
 * Protected Route Component
 * Checks if user is authenticated and has required role
 */
export default function ProtectedRoute({ children, roles }) {
    const user = getUser();

    console.log("Checking protected route - User:", user, "Required roles:", roles);

    if (!user) {
        console.warn("No user found, redirecting to login");
        return <Navigate to="/" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        console.warn(`User role '${user.role}' not in allowed roles:`, roles);
        return <Navigate to="/stores" replace />;
    }

    console.log("Access granted");
    return children;
}