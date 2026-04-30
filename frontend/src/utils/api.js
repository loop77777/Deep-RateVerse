import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const trimmedApiUrl = rawApiUrl.replace(/\/+$/, "");
const API_BASE_URL = trimmedApiUrl.endsWith("/api") ? trimmedApiUrl : `${trimmedApiUrl}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// -------- REQUEST INTERCEPTOR --------
// Add token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("📤 Request:", config.method.toUpperCase(), config.url);
    return config;
}, (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
});

// -------- RESPONSE INTERCEPTOR --------
// Handle responses and errors
api.interceptors.response.use(
    (response) => {
        console.log("✅ Response:", response.status, response.data);
        return response.data; // Return only data, not full response
    },
    (error) => {
        console.error("❌ API Error:", error.response?.data || error.message);

        const isAuthRequest = ["/auth/login", "/auth/signup"].includes(error.config?.url);

        // If a protected request gets 401, token expired - logout.
        // Login/signup 401s should stay on the page so the form can show the error.
        if (error.response?.status === 401 && !isAuthRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }

        // Return error but don't throw - let components handle it
        return error.response?.data || { success: false, msg: error.message };
    }
);

export default api;
