const pool = require("../config/db");

// Get all stores with average rating and current user's rating
exports.getStores = async (req, res) => {
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
};

// Add or update rating
exports.rateStore = async (req, res) => {
  const { store_id, rating } = req.body;

  await pool.query(`
    INSERT INTO ratings(user_id, store_id, rating)
    VALUES($1,$2,$3)
    ON CONFLICT (user_id, store_id)
    DO UPDATE SET rating = EXCLUDED.rating
  `, [req.user.id, store_id, rating]);

  res.json({ msg: "Rating saved" });
};