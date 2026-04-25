/**
 * Store Controller
 * Handles store listing and rating logic
 */

const pool = require("../config/db");

/**
 * Get All Stores
 * - Includes average rating
 * - Includes current user's rating
 */
exports.getStores = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT 
        s.id, s.name, s.address,
        COALESCE(AVG(r.rating),0) AS avg_rating,
        MAX(CASE WHEN r.user_id = $1 THEN r.rating END) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `, [userId]);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Add or Update Rating
 */
exports.rateStore = async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    // Rating must be between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1-5" });
    }

    await pool.query(`
      INSERT INTO ratings(user_id, store_id, rating)
      VALUES($1,$2,$3)
      ON CONFLICT (user_id, store_id)
      DO UPDATE SET rating = EXCLUDED.rating
    `, [req.user.id, store_id, rating]);

    res.json({ msg: "Rating saved" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};