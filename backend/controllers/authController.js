const db = require('../config/db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        console.log("Signup request:", { name, email, role });

        // Validation
        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                success: false,
                msg: "All fields required"
            });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                success: false,
                msg: "Name must be 20-60 characters"
            });
        }

        if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(password)) {
            return res.status(400).json({
                success: false,
                msg: "Password must have uppercase + special char (8-16 chars)"
            });
        }

        // Check if email exists
        const checkEmailQuery = `SELECT id FROM users WHERE email = $1`;
        const checkEmailResult = await db.query(checkEmailQuery, [email]);

        if (checkEmailResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                msg: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Create user
        const insertQuery = `
            INSERT INTO users (name, email, password, address, role) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

        const result = await db.query(insertQuery, [name, email, hashedPassword, address, role]);

        console.log("User created:", result.rows[0].id);

        return res.json({
            success: true,
            msg: "Account created successfully"
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            success: false,
            msg: "Error creating account",
            error: err.message
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login request:", email);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Email and password required"
            });
        }

        // Get user
        const getUserQuery = `SELECT * FROM users WHERE email = $1`;
        const userResult = await db.query(getUserQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        const user = userResult.rows[0];

        // Verify password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        if (user.password !== hashedPassword) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret_key_123',
            { expiresIn: '7d' }
        );

        console.log("Login successful:", user.id);

        return res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            msg: "Login successful"
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            msg: "Error logging in",
            error: err.message
        });
    }
};