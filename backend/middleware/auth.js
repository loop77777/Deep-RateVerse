const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
module.exports = (req, res, next) => {
    try {
        // Get token from header: Bearer TOKEN
        const token = req.headers.authorization.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, "secret");

        // Attach user data to request
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
};