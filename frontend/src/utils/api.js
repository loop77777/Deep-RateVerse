import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

        // If 401, token expired - logout
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }

        return Promise.reject(error.response?.data || error);
    }
);

export default api;