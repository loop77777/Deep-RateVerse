const db = require('../config/db');
const crypto = require('crypto');

// Submit rating
exports.submitRating = async (req, res) => {
    try {
        const store_id = Number(req.body.store_id);
        const rating = Number(req.body.rating);
        const user_id = req.user.id;

        console.log("Submitting rating:", { user_id, store_id, rating });

        if (!Number.isInteger(store_id) || !Number.isInteger(rating)) {
            return res.status(400).json({
                success: false,
                msg: "Store ID and rating required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                msg: "Rating must be between 1 and 5"
            });
        }

        const storeResult = await db.query(`SELECT id FROM stores WHERE id = $1`, [store_id]);
        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Store not found"
            });
        }

        const upsertQuery = `
            INSERT INTO ratings (user_id, store_id, rating)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, store_id)
            DO UPDATE SET rating = EXCLUDED.rating
            RETURNING id, user_id, store_id, rating, created_at
        `;
        const result = await db.query(upsertQuery, [user_id, store_id, rating]);

        return res.json({
            success: true,
            data: result.rows[0],
            msg: "Rating saved successfully"
        });
    } catch (err) {
        console.error("Error submitting rating:", err);
        return res.status(500).json({
            success: false,
            msg: "Error submitting rating",
            error: err.message
        });
    }
};

// Update rating
exports.updateRating = async (req, res) => {
    try {
        const ratingId = Number(req.params.ratingId);
        const rating = Number(req.body.rating);
        const user_id = req.user.id;

        console.log("Updating rating:", { ratingId, rating, user_id });

        if (!Number.isInteger(ratingId) || !Number.isInteger(rating)) {
            return res.status(400).json({
                success: false,
                msg: "Rating required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                msg: "Rating must be between 1 and 5"
            });
        }

        // Verify rating belongs to user
        const checkQuery = `SELECT id FROM ratings WHERE id = $1 AND user_id = $2`;
        const checkResult = await db.query(checkQuery, [ratingId, user_id]);

        if (checkResult.rows.length === 0) {
            return res.status(403).json({
                success: false,
                msg: "Not authorized to update this rating"
            });
        }

        const updateQuery = `UPDATE ratings SET rating = $1 WHERE id = $2 RETURNING id, user_id, store_id, rating, created_at`;
        const result = await db.query(updateQuery, [rating, ratingId]);

        return res.json({
            success: true,
            data: result.rows[0],
            msg: "Rating updated successfully"
        });
    } catch (err) {
        console.error("Error updating rating:", err);
        return res.status(500).json({
            success: false,
            msg: "Error updating rating",
            error: err.message
        });
    }
};

// Get user's rating for a store
exports.getUserRating = async (req, res) => {
    try {
        const storeId = Number(req.params.storeId);
        const user_id = req.user.id;

        console.log("Getting user rating:", { user_id, storeId });

        if (!Number.isInteger(storeId)) {
            return res.status(400).json({
                success: false,
                msg: "Valid store ID required"
            });
        }

        const query = `SELECT id, rating, store_id, created_at FROM ratings WHERE user_id = $1 AND store_id = $2`;
        const result = await db.query(query, [user_id, storeId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No rating found"
            });
        }

        return res.json({
            success: true,
            data: result.rows[0],
            msg: "Rating fetched successfully"
        });
    } catch (err) {
        console.error("Error fetching rating:", err);
        return res.status(500).json({
            success: false,
            msg: "Error fetching rating",
            error: err.message
        });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user_id = req.user.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                msg: "Old and new password required"
            });
        }

        // Get user
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await db.query(query, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        const user = result.rows[0];

        // Verify old password
        const hashedOldPassword = crypto.createHash('sha256').update(oldPassword).digest('hex');

        if (user.password !== hashedOldPassword) {
            return res.status(401).json({
                success: false,
                msg: "Old password is incorrect"
            });
        }

        // Update with new password
        const hashedNewPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashedNewPassword, user_id]);

        return res.json({
            success: true,
            msg: "Password updated successfully"
        });
    } catch (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({
            success: false,
            msg: "Error updating password",
            error: err.message
        });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user_id = req.user.id;

        const query = `SELECT id, name, email, address, role FROM users WHERE id = $1`;
        const result = await db.query(query, [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        return res.json({
            success: true,
            data: result.rows[0],
            msg: "Profile fetched successfully"
        });
    } catch (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).json({
            success: false,
            msg: "Error fetching profile",
            error: err.message
        });
    }
};
