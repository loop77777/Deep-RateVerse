/**
 * Express Server Configuration
 */

// -------- LOAD ENV VARIABLES FIRST --------
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// -------- CORS CONFIGURATION --------
const normalizeOrigin = (origin) => origin?.replace(/\/+$/, "");

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL
].filter(Boolean).map(normalizeOrigin);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------- ROOT ROUTE --------
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "RateVerse Backend API Server",
        version: "1.0.0",
        apiBase: "/api"
    });
});

// -------- HEALTH CHECK --------
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

// -------- API ROOT ROUTE --------
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "RateVerse API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth/login, /api/auth/signup",
            stores: "/api/store/all, /api/store/search",
            admin: "/api/admin/...",
            owner: "/api/owner/..."
        }
    });
});

// -------- REQUEST LOGGING MIDDLEWARE --------
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// -------- ROUTES --------
const routes = require("./routes/index");
app.use("/api", routes);

// -------- 404 ERROR HANDLER --------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`
    });
});

// -------- ERROR HANDLING MIDDLEWARE --------
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API base URL: http://localhost:${PORT}/api`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    server.on("error", (err) => {
        console.error("Server failed to start:", err.message);
        process.exit(1);
    });
}

module.exports = app;
