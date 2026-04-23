// Import Pool from pg (PostgreSQL client)
const { Pool } = require("pg");

// Create connection pool to PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "store_rating",
    password: "postgres12pass",
    port: 5432,
});

// Export pool to use in controllers
module.exports = pool;