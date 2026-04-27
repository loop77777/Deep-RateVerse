const db = require('../config/db');

// Get all stores
exports.getAllStores = async (req, res) => {
  try {
    console.log("Fetching all stores...");

    const query = `
            SELECT 
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id, s.name, s.email, s.address
            ORDER BY s.name ASC
        `;

    const result = await db.query(query);
    console.log("Stores fetched:", result.rows.length);

    return res.json({
      success: true,
      data: result.rows,
      msg: "Stores fetched successfully"
    });
  } catch (err) {
    console.error("Error fetching stores:", err);
    return res.status(500).json({
      success: false,
      msg: "Error fetching stores",
      error: err.message
    });
  }
};

// Search stores
exports.searchStores = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        msg: "Search query required"
      });
    }

    console.log("Searching stores with query:", q);

    const query = `
            SELECT 
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.name ILIKE $1 OR s.address ILIKE $1
            GROUP BY s.id, s.name, s.email, s.address
            ORDER BY s.name ASC
        `;

    const result = await db.query(query, [`%${q}%`]);
    console.log("Search results:", result.rows.length);

    return res.json({
      success: true,
      data: result.rows,
      msg: "Search completed"
    });
  } catch (err) {
    console.error("Error searching stores:", err);
    return res.status(500).json({
      success: false,
      msg: "Error searching stores",
      error: err.message
    });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        msg: "Valid store ID required"
      });
    }

    const query = `
            SELECT 
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.id = $1
            GROUP BY s.id, s.name, s.email, s.address
        `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Store not found"
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
      msg: "Store fetched successfully"
    });
  } catch (err) {
    console.error("Error fetching store:", err);
    return res.status(500).json({
      success: false,
      msg: "Error fetching store",
      error: err.message
    });
  }
};
