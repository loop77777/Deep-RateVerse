/**
 * Authentication Utility Functions
 */

export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user:", error);
        return null;
    }
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const setUser = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
};

export const isAuthenticated = () => {
    return !!getUser() && !!getToken();
};