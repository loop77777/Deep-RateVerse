/**
 * Authentication Middleware
 *
 * Purpose: Verify JWT token and attach user info to request
 *
 * Flow:
 * 1. Extract Bearer token from Authorization header
 * 2. Validate token signature using JWT_SECRET
 * 3. Decode token to get user data
 * 4. Attach user data to req.user for downstream routes
 * 5. Call next() to proceed or reject with 401
 *
 * Usage: router.get("/protected", auth, controller)
 */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // -------- STEP 1: Extract Token --------
        // Authorization header format: "Bearer eyJhbGc..."
        // Split by space and take second part (index 1)
        const token = req.headers.authorization?.split(" ")[1];

        // -------- STEP 2: Validate Token Exists --------
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No token provided - Please login first"
            });
        }

        // -------- STEP 3: Verify & Decode Token --------
        // jwt.verify() validates signature and checks expiration
        // Throws error if token is invalid or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // -------- STEP 4: Attach User Data to Request --------
        // decoded contains: { id, email, role, iat, exp }
        // Now available as req.user in downstream routes
        req.user = decoded;

        // -------- STEP 5: Proceed to Next Middleware/Route --------
        next();

    } catch (err) {
        // -------- ERROR HANDLING --------
        // Token invalid, expired, or tampered with
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token - Please login again",
            error: err.message
        });
    }
};