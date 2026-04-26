/**
 * Store Controller
 * Handles store operations
 */

const pool = require("../config/db");

/**
 * Get all stores
 */
exports.getStores = async (req, res) => {
  try {
    const stores = await pool.query("SELECT * FROM stores");

    res.json({
      success: true,
      data: stores.rows || []
    });
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch stores"
    });
  }
};

/**
 * Rate a store
 */
exports.rateStore = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        msg: "Invalid store ID or rating"
      });
    }

    // Save rating to database
    await pool.query(
      "INSERT INTO ratings(user_id, store_id, rating) VALUES($1, $2, $3)",
      [userId, storeId, rating]
    );

    res.json({
      success: true,
      msg: "Rating saved successfully"
    });
  } catch (err) {
    console.error("Error rating store:", err);
    res.status(500).json({
      success: false,
      msg: "Failed to rate store"
    });
  }
};