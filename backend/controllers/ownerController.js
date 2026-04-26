/**
 * Owner Controller
 * Handles store owner operations
 */

const pool = require("../config/db");

/**
 * Owner Dashboard - View ratings for their store
 */
exports.dashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // -------- GET OWNER'S STORE --------
    const store = await pool.query(
      "SELECT * FROM stores WHERE owner_id = $1",
      [ownerId]
    );

    if (!store.rows.length) {
      return res.json({ success: true, msg: "No store found", ratings: [] });
    }

    const storeId = store.rows[0].id;

    // -------- GET RATINGS FOR THIS STORE --------
    const ratings = await pool.query(
      `SELECT r.*, u.name, u.email
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             WHERE r.store_id = $1
             ORDER BY r.created_at DESC`,
      [storeId]
    );

    // -------- CALCULATE AVERAGE RATING --------
    const avgRating = await pool.query(
      "SELECT AVG(rating) as avg FROM ratings WHERE store_id = $1",
      [storeId]
    );

    res.json({
      success: true,
      store: store.rows[0],
      averageRating: avgRating.rows[0].avg || 0,
      ratings: ratings.rows
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};