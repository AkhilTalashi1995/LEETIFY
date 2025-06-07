import * as userService from "../services/user.service.js";
import User from "../models/user/user.js";
import bcrypt from "bcrypt";

// CREATE USER
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

// LOGIN USER
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

// GET ALL USERS (for admin panel)
export const getAllUsers = async (req, res, next) => {
  try {
    // Only return non-sensitive fields!
    const users = await User.find({}, "firstname lastname email user_status");
    return res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const { _id, firstname, lastname, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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

// GET LOGGED IN USER PROFILE
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
