require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes"));

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});