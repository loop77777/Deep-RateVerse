const db = require("../config/db");

// Get dashboard
exports.getDashboard = async (req, res) => {
  try {
    console.log("Fetching owner dashboard...");

    const user_id = req.user.id;

    // Get owner's store
    const storeQuery = `SELECT id FROM stores WHERE owner_id = $1`;
    const storeResult = await db.query(storeQuery, [user_id]);

    if (storeResult.rows.length === 0) {
      return res.json({
        success: true,
        data: { store: null, ratings: [], averageRating: 0 },
        store: null,
        ratings: [],
        averageRating: 0,
        msg: "No store found"
      });
    }

    const store_id = storeResult.rows[0].id;

    // Get store details
    const storeDetailsQuery = `
      SELECT s.*, COALESCE(AVG(r.rating), 0) as average_rating, COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id
    `;
    const storeDetailsResult = await db.query(storeDetailsQuery, [store_id]);
    const ratingsQuery = `
      SELECT r.id, r.rating, r.created_at, u.name, u.email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `;
    const ratingsResult = await db.query(ratingsQuery, [store_id]);

    const store = storeDetailsResult.rows[0] || {};
    const averageRating = Number(store.average_rating) || 0;

    return res.json({
      success: true,
      data: { store, ratings: ratingsResult.rows, averageRating },
      store,
      ratings: ratingsResult.rows,
      averageRating,
      msg: "Dashboard fetched successfully"
    });
  } catch (err) {
    console.error("Error fetching owner dashboard:", err);
    return res.status(500).json({
      success: false,
      msg: "Error fetching dashboard",
      error: err.message
    });
  }
};

// Get store ratings
exports.getStoreRatings = async (req, res) => {
  try {
    console.log("Fetching store ratings...");

    const user_id = req.user.id;

    const storeQuery = `SELECT id FROM stores WHERE owner_id = $1`;
    const storeResult = await db.query(storeQuery, [user_id]);

    if (storeResult.rows.length === 0) {
      return res.json({
        success: true,
        data: [],
        msg: "No store found"
      });
    }

    const store_id = storeResult.rows[0].id;

    const query = `
      SELECT r.id, r.rating, r.created_at, u.name, u.email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `;

    const result = await db.query(query, [store_id]);

    return res.json({
      success: true,
      data: result.rows,
      msg: "Ratings fetched successfully"
    });
  } catch (err) {
    console.error("Error fetching ratings:", err);
    return res.status(500).json({
      success: false,
      msg: "Error fetching ratings",
      error: err.message
    });
  }
};
