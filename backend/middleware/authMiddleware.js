const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "ucu_secret_key";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
module.exports.verifyToken = authMiddleware;