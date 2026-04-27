const db = require('../config/db');
const crypto = require('crypto');

// Get dashboard
exports.getDashboard = async (req, res) => {
    try {
        console.log("Fetching admin dashboard...");

        const usersResult = await db.query(`SELECT COUNT(*) as count FROM users`);
        const storesResult = await db.query(`SELECT COUNT(*) as count FROM stores`);
        const ratingsResult = await db.query(`SELECT COUNT(*) as count FROM ratings`);

        return res.json({
            success: true,
            data: {
                total_users: parseInt(usersResult.rows[0].count) || 0,
                total_stores: parseInt(storesResult.rows[0].count) || 0,
                total_ratings: parseInt(ratingsResult.rows[0].count) || 0
            },
            msg: "Dashboard fetched successfully"
        });
    } catch (err) {
        console.error("Error fetching dashboard:", err);
        return res.status(500).json({
            success: false,
            msg: "Error fetching dashboard",
            error: err.message
        });
    }
};

// Create store
exports.createStore = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        console.log("Creating store:", { name, email });

        if (!name || !email || !address) {
            return res.status(400).json({
                success: false,
                msg: "All fields required"
            });
        }

        const insertQuery = `INSERT INTO stores (name, email, address) VALUES ($1, $2, $3) RETURNING id`;
        const result = await db.query(insertQuery, [name, email, address]);

        return res.json({
            success: true,
            data: { id: result.rows[0].id },
            msg: "Store created successfully"
        });
    } catch (err) {
        console.error("Error creating store:", err);
        return res.status(500).json({
            success: false,
            msg: "Error creating store",
            error: err.message
        });
    }
};

// Create user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        console.log("Creating user:", { name, email, role });

        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                success: false,
                msg: "All fields required"
            });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const insertQuery = `INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const result = await db.query(insertQuery, [name, email, hashedPassword, address, role]);

        return res.json({
            success: true,
            data: { id: result.rows[0].id },
            msg: "User created successfully"
        });
    } catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({
            success: false,
            msg: "Error creating user",
            error: err.message
        });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        console.log("Fetching all users...");

        const query = `SELECT id, name, email, address, role FROM users`;
        const result = await db.query(query);

        return res.json({
            success: true,
            data: result.rows,
            msg: "Users fetched successfully"
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({
            success: false,
            msg: "Error fetching users",
            error: err.message
        });
    }
};

// Search users
exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                msg: "Search query required"
            });
        }

        console.log("Searching users:", q);

        const query = `SELECT id, name, email, address, role FROM users WHERE name ILIKE $1 OR email ILIKE $1`;
        const result = await db.query(query, [`%${q}%`]);

        return res.json({
            success: true,
            data: result.rows,
            msg: "Search completed"
        });
    } catch (err) {
        console.error("Error searching users:", err);
        return res.status(500).json({
            success: false,
            msg: "Error searching users",
            error: err.message
        });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Deleting user:", id);

        const deleteQuery = `DELETE FROM users WHERE id = $1`;
        await db.query(deleteQuery, [id]);

        return res.json({
            success: true,
            msg: "User deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({
            success: false,
            msg: "Error deleting user",
            error: err.message
        });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, address, role } = req.body;

        console.log("Updating user:", id);

        if (!name || !email || !address || !role) {
            return res.status(400).json({
                success: false,
                msg: "All fields required"
            });
        }

        const updateQuery = `UPDATE users SET name = $1, email = $2, address = $3, role = $4 WHERE id = $5`;
        await db.query(updateQuery, [name, email, address, role, id]);

        return res.json({
            success: true,
            msg: "User updated successfully"
        });
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({
            success: false,
            msg: "Error updating user",
            error: err.message
        });
    }
};