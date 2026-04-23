const pool = require("../config/db");

// Owner dashboard with fixed aggregation and safe handling
exports.dashboard = async (req, res) => {
  const ownerId = req.user.id;

  // Get stores owned by this owner
  const stores = await pool.query(
    "SELECT id FROM stores WHERE owner_id=$1",
    [ownerId]
  );

  const storeIds = stores.rows.map(s => s.id);

  if (storeIds.length === 0) {
    return res.json({ avg_rating: 0, users: [] });
  }

  // Average rating
  const avg = await pool.query(
    `SELECT COALESCE(AVG(rating),0) AS avg
     FROM ratings
     WHERE store_id = ANY($1::int[])`,
    [storeIds]
  );

  // Users who rated
  const users = await pool.query(
    `SELECT u.name, u.email, r.rating, s.name AS store_name
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     JOIN stores s ON s.id = r.store_id
     WHERE r.store_id = ANY($1::int[])`,
    [storeIds]
  );

  res.json({
    avg_rating: avg.rows[0].avg,
    users: users.rows,
  });
};