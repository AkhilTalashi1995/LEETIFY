import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user/user.js";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Creates a new user with hashed password and saves to the database.
 * Throws if the user already exists.
 *
 * @param {string} firstname - User's first name
 * @param {string} lastname - User's last name
 * @param {string} email - User's email (must be unique)
 * @param {string} password - Raw user password
 * @param {string} user_status - Role: "USER", "PREMIUM_USER", "ADMIN"
 * @returns {Promise<Object>} The created User document
 * @throws {Error} If the user already exists
 */
export const createUser = async (
  firstname,
  lastname,
  email,
  password,
  user_status
) => {
  // Generate salt and hash password for secure storage
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Check for duplicate user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error(
      "User already exists! Please login with valid credentials!"
    );
  }

  // Create and save new user
  const user = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    user_status,
  });
  await user.save();
  return user;
};

/**
 * Authenticates a user by email and password, returns JWT token on success.
 *
 * @param {string} email - User's email
 * @param {string} password - Raw password
 * @returns {Promise<{token: string, user: Object}>} JWT and user document
 * @throws {Error} If credentials are invalid
 */
export const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }

  // Verify password hash
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid login credentials");
  }

  // Issue JWT with userId as payload
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  return { token, user };
};
