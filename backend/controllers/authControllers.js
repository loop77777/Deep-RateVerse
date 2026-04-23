const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup (Normal User)
exports.signup = async (req, res) => {
    const { name, email, password, address } = req.body;

    // Validate name length
    if (name.length < 20 || name.length > 60)
        return res.status(400).json({ msg: "Invalid name length" });

    // Validate password
    if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(password))
        return res.status(400).json({ msg: "Weak password" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await pool.query(
        `INSERT INTO users(name,email,password,address,role)
     VALUES($1,$2,$3,$4,'user') RETURNING *`,
        [name, email, hashedPassword, address]
    );

    res.json(result.rows[0]);
};

// Login (All roles)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

    if (!user.rows.length)
        return res.status(400).json({ msg: "User not found" });

    // Compare password
    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isValid) return res.status(400).json({ msg: "Wrong password" });

    // Create token
    const token = jwt.sign(
        { id: user.rows[0].id, role: user.rows[0].role },
        "secret"
    );

    res.json({ token });
};