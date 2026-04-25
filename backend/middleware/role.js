/**
 * Role-based authorization middleware
 */
module.exports = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role: ${allowedRoles.join(", ")}`
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
};