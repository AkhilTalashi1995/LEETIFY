import * as userService from "../services/user.service.js";
import User from "../models/user/user.js";
import bcrypt from "bcrypt";

/**
 * Create a new user account.
 * Delegates creation logic to the user service.
 * Handles duplicate user and generic errors.
 *
 * @route POST /users/register
 * @param {Object} req - Express request (expects firstname, lastname, email, password, user_status in body)
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware function
 * @returns {Object} user - Created user document (without sensitive fields)
 */
export const createUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, user_status } = req.body;
    const user = await userService.createUser(
      firstname,
      lastname,
      email,
      password,
      user_status
    );
    res.status(201).json({ user });
  } catch (err) {
    if (
      err.message ===
      "User already exists! Please login with valid credentials!"
    ) {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Log in a user and return JWT token.
 * Delegates authentication to the user service.
 *
 * @route POST /users/login
 * @param {Object} req - Express request (expects email, password in body)
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware function
 * @returns {Object} token, user - JWT token and user document (non-sensitive fields)
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all users for admin panel (only safe fields).
 *
 * @route GET /users
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware function
 * @returns {Object} users - Array of user documents (firstname, lastname, email, user_status)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    // Only return non-sensitive fields!
    const users = await User.find({}, "firstname lastname email user_status");
    return res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update an existing user's profile (including password).
 * Hashes new password before saving.
 *
 * @route PUT /users/:id
 * @param {Object} req - Express request (expects _id, firstname, lastname, email, password in body)
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware function
 * @returns {Object} user - Updated user document
 */
export const updateUser = async (req, res, next) => {
  try {
    const { _id, firstname, lastname, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields and save
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.password = hashedPassword;
    await user.save();

    res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Delete a user by ID (admin-only).
 * Prevents deletion of admin users.
 *
 * @route DELETE /users/:id
 * @param {Object} req - Express request (expects id param)
 * @param {Object} res - Express response
 * @returns {Object} message - Deletion status
 */
export const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    // Find the user to delete
    const user = await User.findById(userIdToDelete);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent deleting ADMIN users
    if (user.user_status === "ADMIN") {
      return res.status(403).json({ message: "Cannot delete an admin user." });
    }

    await User.findByIdAndDelete(userIdToDelete);
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get the profile of the currently authenticated user.
 *
 * @route GET /users/me
 * @param {Object} req - Express request (expects userId on req)
 * @param {Object} res - Express response
 * @returns {Object} user - Authenticated user's document
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
