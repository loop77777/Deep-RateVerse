const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Admin dashboard
exports.dashboard = async (req, res) => {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const stores = await pool.query("SELECT COUNT(*) FROM stores");
    const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

    res.json({
        users: users.rows[0].count,
        stores: stores.rows[0].count,
        ratings: ratings.rows[0].count,
    });
};

// Add user (admin, user, owner)
exports.addUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await pool.query(
        `INSERT INTO users(name,email,password,address,role)
     VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role`,
        [name, email, hash, address, role]
    );

    res.json(user.rows[0]);
};

// Add store
exports.addStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    const store = await pool.query(
        `INSERT INTO stores(name,email,address,owner_id)
     VALUES($1,$2,$3,$4) RETURNING *`,
        [name, email, address, owner_id]
    );

    res.json(store.rows[0]);
};

// getStores 
exports.getStores = async (req, res) => {
    const { search = "", owner_id, sort = "name", order = "asc" } = req.query;

    const allowedSort = ["name", "email", "address"];
    const allowedOrder = ["asc", "desc"];

    const sortField = allowedSort.includes(sort) ? sort : "name";
    const sortOrder = allowedOrder.includes(order) ? order : "asc";

    let query = `
    SELECT id,name,email,address,owner_id
    FROM stores
    WHERE name ILIKE $1 OR email ILIKE $1
  `;

    if (owner_id) query += ` AND owner_id=${owner_id}`;

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(query, [`%${search}%`]);

    res.json(result.rows);
};


// Safe filtering and sorting
exports.getUsers = async (req, res) => {
    const { search = "", role, sort = "name", order = "asc" } = req.query;

    const allowedSort = ["name", "email", "role"];
    const allowedOrder = ["asc", "desc"];

    const sortField = allowedSort.includes(sort) ? sort : "name";
    const sortOrder = allowedOrder.includes(order) ? order : "asc";

    let query = `
    SELECT id,name,email,address,role
    FROM users
    WHERE name ILIKE $1 OR email ILIKE $1
  `;

    if (role) query += ` AND role='${role}'`;

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(query, [`%${search}%`]);

    res.json(result.rows);
};