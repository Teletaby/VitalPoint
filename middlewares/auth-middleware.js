const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from "Authorization: Bearer <token>"
    console.log("token retrieved from authorization:", token)
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded data (e.g., role, username) to the request object
        next();
    } catch (err) {
        res.status(403).json({ message: 'Access Denied: Invalid Token' });
    }
};

const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: `Access Denied: Requires ${role} Role` });
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeRole,
};

// authenticateToken made the routing complex. Not used