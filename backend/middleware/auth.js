// Import jsonwebtoken library for verifying tokens
const jwt = require("jsonwebtoken");

// Export middleware function
module.exports = (req, res, next) => {

    try {
        // Extract token from Authorization header (Bearer token)
        const token = req.headers.authorization?.split(" ")[1];

        // Check if token is missing
        if (!token) {
            // Return unauthorized response if no token is provided
            return res.status(401).json({
                success: false,
                msg: "No token provided - Please login first"
            });
        }

        // Verify token using secret key and decode payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user data to request object
        req.user = decoded;

        // Move to next middleware or route handler
        next();

    } catch (err) {
        // Handle invalid or expired token errors
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token - Please login again",
            error: err.message
        });
    }
};