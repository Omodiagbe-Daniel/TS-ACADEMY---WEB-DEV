const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send("Aunthentication required");
        }
        const verifyAuthHeader = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
        req.userId = verifyAuthHeader.userId;
        next();    
    } catch (error) {
        return res.status(401).send("Invalid or expired token");;
    }
}


module.exports = authentication;
