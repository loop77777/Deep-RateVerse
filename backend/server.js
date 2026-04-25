/**
 * Express Server Configuration
 */

// -------- LOAD ENV VARIABLES FIRST --------
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// -------- CORS CONFIGURATION --------
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------- SECURITY HEADERS --------
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// -------- ROOT ROUTE --------
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 Roxiler Backend API Server",
        version: "1.0.0",
        apiBase: "http://localhost:5000/api"
    });
});

// -------- HEALTH CHECK --------
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "✅ Server is running"
    });
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
    console.error("❌ Server Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API base URL: http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});

server.on("error", (err) => {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
});

module.exports = app;