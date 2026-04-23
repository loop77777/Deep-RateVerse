// Role-based authorization middleware
module.exports = (roles) => (req, res, next) => {
    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Forbidden" });
    }
    next();
};