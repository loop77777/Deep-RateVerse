// Import Pool from pg (PostgreSQL client)
const { Pool } = require("pg");
require("dotenv").config();

// Create connection pool to PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "store_rating",
    password: process.env.DB_PASSWORD || "postgres12pass",
    port: Number(process.env.DB_PORT) || 5432,
});

// Export pool to use in controllers
module.exports = pool;
