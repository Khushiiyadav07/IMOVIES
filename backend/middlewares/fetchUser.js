const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate JWT token from requests
 * Checks header "auth-token", "Authorization" (Bearer token), or "x-auth-token"
 */
const fetchUser = (req, res, next) => {
  // Get the token from header
  let token = req.header("auth-token") || req.header("x-auth-token") || req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided."
    });
  }

  // If token is prefixed with "Bearer ", strip it
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "imovies_super_secret_jwt_key_2026";
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user || data;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please authenticate again."
    });
  }
};

/**
 * Middleware to restrict route access exclusively to Admin accounts
 */
const fetchAdmin = (req, res, next) => {
  fetchUser(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Admin privileges required for this action."
      });
    }
  });
};

module.exports = fetchUser;
module.exports.fetchUser = fetchUser;
module.exports.fetchAdmin = fetchAdmin;

