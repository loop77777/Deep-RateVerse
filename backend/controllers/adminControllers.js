const pool = require("../config/db");

// Admin dashboard stats
exports.dashboard = async (req, res) => {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const stores = await pool.query("SELECT COUNT(*) FROM stores");
    const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

    res.json({
        users: users.rows[0].count,
        stores: stores.rows[0].count,
        ratings: ratings.rows[0].count
    });
};