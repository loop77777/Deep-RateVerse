/**
 * Admin Controller
 * Handles admin operations
 */

const pool = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Add new user (Admin only)
 */
exports.addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // -------- VALIDATION --------
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ success: false, msg: "Invalid name" });
        }

        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existing.rows.length) {
            return res.status(400).json({ success: false, msg: "User already exists" });
        }

        // -------- CREATE USER --------
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await pool.query(
            `INSERT INTO users(name, email, password, address, role)
             VALUES($1,$2,$3,$4,$5)
             RETURNING id, name, email, role, address`,
            [name, email, hashedPassword, address, role || 'user']
        );

        res.json({ success: true, msg: "User created", user: user.rows[0] });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

/**
 * Add new store (Admin only)
 */
exports.addStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({ success: false, msg: "Missing required fields" });
        }

        const store = await pool.query(
            `INSERT INTO stores(name, email, address, owner_id, rating)
             VALUES($1,$2,$3,$4,0)
             RETURNING *`,
            [name, email, address, owner_id]
        );

        res.json({ success: true, msg: "Store created", store: store.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

/**
 * Get all users with filters
 */
exports.getUsers = async (req, res) => {
    try {
        const { search, role, sortBy } = req.query;
        let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
        const params = [];

        if (search) {
            query += ` AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`;
            params.push(`%${search}%`);
        }

        if (role) {
            query += ` AND role = $${params.length + 1}`;
            params.push(role);
        }

        if (sortBy) {
            query += ` ORDER BY ${sortBy} ASC`;
        }

        const users = await pool.query(query, params);
        res.json({ success: true, data: users.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

/**
 * Get all stores with filters
 */
exports.getStores = async (req, res) => {
    try {
        const { search, sortBy } = req.query;
        let query = "SELECT * FROM stores WHERE 1=1";
        const params = [];

        if (search) {
            query += ` AND (name ILIKE $${params.length + 1} OR address ILIKE $${params.length + 1})`;
            params.push(`%${search}%`);
        }

        if (sortBy) {
            query += ` ORDER BY ${sortBy} ASC`;
        }

        const stores = await pool.query(query, params);
        res.json({ success: true, data: stores.rows });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

/**
 * Admin Dashboard stats
 */
exports.dashboard = async (req, res) => {
    try {
        const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
        const totalStores = await pool.query("SELECT COUNT(*) FROM stores");
        const totalRatings = await pool.query("SELECT COUNT(*) FROM ratings");

        res.json({
            success: true,
            stats: {
                users: totalUsers.rows[0].count,
                stores: totalStores.rows[0].count,
                ratings: totalRatings.rows[0].count
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};