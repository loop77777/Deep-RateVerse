const pool = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Update password
 */
exports.updatePassword = async (req, res) => {
    const { password } = req.body;

    if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(password))
        return res.status(400).json({ msg: "Weak password" });

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
        "UPDATE users SET password=$1 WHERE id=$2",
        [hash, req.user.id]
    );

    res.json({ msg: "Password updated" });
};