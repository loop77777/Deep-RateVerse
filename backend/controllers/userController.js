/**
 * User Controller
 * Handles user operations like password update
 */

const pool = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Update user password
 * Validates old password and updates to new password
 */
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        // -------- VALIDATION --------
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                msg: "Old and new passwords required"
            });
        }

        if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(newPassword)) {
            return res.status(400).json({
                success: false,
                msg: "Password must have uppercase + special char (8-16 chars)"
            });
        }

        // -------- GET USER --------
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (!user.rows.length) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        // -------- VERIFY OLD PASSWORD --------
        const isValid = await bcrypt.compare(oldPassword, user.rows[0].password);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                msg: "Incorrect current password"
            });
        }

        // -------- HASH NEW PASSWORD --------
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // -------- UPDATE PASSWORD --------
        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, userId]
        );

        res.json({
            success: true,
            msg: "Password updated successfully"
        });

    } catch (err) {
        console.error("Password update error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};