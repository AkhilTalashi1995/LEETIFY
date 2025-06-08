import mongoose from "mongoose";

/**
 * User Schema - Represents a registered user on the platform.
 *
 * Fields:
 * - firstname:          User's first name (required)
 * - lastname:           User's last name (required)
 * - email:              Unique email address (required, must be unique)
 * - password:           Hashed password (required)
 * - user_status:        "USER" (default), "PREMIUM_USER", or "ADMIN" (required)
 * - subscription_end:   Expiry date of premium subscription (if applicable)
 * - submisssions:       Array of user's submissions (references Submission model)
 * - created_at:         Timestamp of user registration
 */
const userSchema = new mongoose.Schema({
  /** User's first name */
  firstname: {
    type: String,
    required: true,
  },
  /** User's last name */
  lastname: {
    type: String,
    required: true,
  },
  /** User's email address (unique identifier) */
  email: {
    type: String,
    required: true,
    unique: true,
  },
  /** Hashed password */
  password: {
    type: String,
    required: true,
  },
  /**
   * User status (role):
   * - "USER":        Regular user
   * - "PREMIUM_USER": Premium subscriber
   * - "ADMIN":       Platform administrator
   */
  user_status: {
    type: String,
    enum: ["USER", "PREMIUM_USER", "ADMIN"],
    required: true,
  },
  /** Date when premium subscription ends (optional, only for PREMIUM_USER) */
  subscription_end: {
    type: Date,
  },
  /**
   * Array of user submissions.
   * Each element references a Submission document by ObjectId.
   * NOTE: The field is currently spelled "submisssions" (with three 's').
   *       For clarity/consistency, consider renaming to "submissions" in all code and DB.
   */
  submisssions: [
    {
      submission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
    },
  ],
  /** Timestamp of when the user was created/registered */
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
