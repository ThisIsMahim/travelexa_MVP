const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        message: "Auth failed",
        success: false,
      });
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Auth failed",
        success: false,
      });
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production");
    req.user = {
      id: decodedToken.userId,
      isAdmin: decodedToken.isAdmin
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({
        message: "Token expired. Please log in again.",
        success: false,
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({
        message: "Invalid token. Please log in again.",
        success: false,
        code: 'INVALID_TOKEN'
      });
    }
    
    res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};
