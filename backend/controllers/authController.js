/**
 * Authentication Controller
 * Handles signup and login logic
 */

const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// -------- VERIFY JWT_SECRET EXISTS --------
if (!process.env.JWT_SECRET) {
    console.error("CRITICAL ERROR: JWT_SECRET not found in .env file!");
    console.error("Please add JWT_SECRET to your .env file");
    process.exit(1);
}

/**
 * User Signup
 * Validates input, checks if user exists, hashes password, and creates user
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // -------- VALIDATION: Name --------
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({
                success: false,
                msg: "Name must be 20-60 characters"
            });
        }

        // -------- VALIDATION: Email --------
        if (!email || !email.includes("@")) {
            return res.status(400).json({
                success: false,
                msg: "Invalid email"
            });
        }

        // -------- VALIDATION: Address --------
        if (!address || address.length > 400) {
            return res.status(400).json({
                success: false,
                msg: "Invalid address"
            });
        }

        // -------- VALIDATION: Password --------
        if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(password)) {
            return res.status(400).json({
                success: false,
                msg: "Password must have uppercase + special char (8-16 chars)"
            });
        }

        // -------- CHECK IF USER EXISTS --------
        const existing = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existing.rows.length) {
            return res.status(400).json({
                success: false,
                msg: "User already exists"
            });
        }

        // -------- HASH PASSWORD --------
        const hashedPassword = await bcrypt.hash(password, 10);

        // -------- INSERT USER --------
        const user = await pool.query(
            `INSERT INTO users(name, email, password, address, role)
             VALUES($1,$2,$3,$4,'user')
             RETURNING id, name, email, role`,
            [name, email, hashedPassword, address]
        );

        // -------- RETURN SUCCESS --------
        res.status(201).json({
            success: true,
            msg: "User created successfully",
            user: user.rows[0]
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

/**
 * Login
 * Authenticates user and generates JWT token
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // -------- VALIDATION: Email & Password --------
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Email and password required"
            });
        }

        // -------- FIND USER --------
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (!user.rows.length) {
            return res.status(401).json({
                success: false,
                msg: "User not found"
            });
        }

        // -------- COMPARE PASSWORD --------
        const isValid = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!isValid) {
            return res.status(401).json({
                success: false,
                msg: "Incorrect password"
            });
        }

        // -------- GENERATE JWT TOKEN --------
        console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // -------- RETURN SUCCESS WITH TOKEN & USER --------
        res.status(200).json({
            success: true,
            msg: "Login successful",
            token: token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                name: user.rows[0].name,
                role: user.rows[0].role
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};