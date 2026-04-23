const pool = require("../config/db");

// Get all stores with avg rating + user rating
exports.getStores = async (req, res) => {
    const userId = req.user.id;

    const result = await pool.query(`
    SELECT s.id, s.name, s.address,
    COALESCE(AVG(r.rating),0) AS avg_rating,
    ur.rating AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    LEFT JOIN ratings ur 
      ON ur.store_id = s.id AND ur.user_id = $1
    GROUP BY s.id, ur.rating
  `, [userId]);

    res.json(result.rows);
};

// Add or update rating
exports.rateStore = async (req, res) => {
    const { store_id, rating } = req.body;

    // Insert or update rating
    await pool.query(`
    INSERT INTO ratings(user_id, store_id, rating)
    VALUES($1,$2,$3)
    ON CONFLICT (user_id, store_id)
    DO UPDATE SET rating = EXCLUDED.rating
  `, [req.user.id, store_id, rating]);

    res.json({ msg: "Rating saved" });
};