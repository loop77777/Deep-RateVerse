const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup for normal users
exports.signup = async (req, res) => {
    const { name, email, password, address } = req.body;

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ msg: "Name must be 20-60 characters" });
    }

    if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(password)) {
        return res.status(400).json({ msg: "Password not strong enough" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users(name,email,password,address,role)
     VALUES($1,$2,$3,$4,'user') RETURNING id,name,email,role`,
        [name, email, hash, address]
    );

    res.json(result.rows[0]);
};

// Login for all roles
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

    if (!user.rows.length) {
        return res.status(400).json({ msg: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign(
        { id: user.rows[0].id, role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token });
};