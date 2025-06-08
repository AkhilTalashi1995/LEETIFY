import jwt from "jsonwebtoken";
import User from "../models/user/user.js";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Middleware to verify JWT token and authenticate user.
 * Extracts the token from the 'Authorization' header,
 * verifies it, and attaches the userId to req.
 *
 * Usage: Add to protected routes.
 *
 * @param {Object} req - Express request object (expects 'Authorization' header with 'Bearer <token>')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends 401 if no/invalid token; otherwise calls next()
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  // Verify JWT token using secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    // Attach userId from token payload to req for downstream use
    req.userId = decoded.userId;
    next();
  });
};

/**
 * Middleware to restrict access to admin users only.
 * Requires verifyToken to run before (req.userId must be set).
 *
 * Usage: Add after verifyToken on routes that need admin protection.
 *
 * @param {Object} req - Express request object (expects req.userId)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends 403 if not admin; otherwise calls next()
 */
export const requireAdmin = async (req, res, next) => {
  try {
    // Look up user by ID attached to req by verifyToken
    const user = await User.findById(req.userId);
    if (user && user.user_status === "ADMIN") {
      return next();
    }
    return res.status(403).json({ message: "Admins only" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
