import jwt from "jsonwebtoken";
import User from "../models/user/user.js";
import * as dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.user_status === "ADMIN") {
      return next();
    }
    return res.status(403).json({ message: "Admins only" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
