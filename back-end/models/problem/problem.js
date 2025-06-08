import mongoose from "mongoose";

/**
 * Problem Schema - Represents a coding problem for the platform.
 *
 * Fields:
 * - title:        Unique problem name/title (required)
 * - description:  Full markdown/text description (required)
 * - starter_code: Boilerplate code provided to users (required)
 * - difficulty:   Problem difficulty; one of "Easy", "Medium", "Hard" (required)
 * - locked:       Boolean flag if problem is premium/locked (default: false)
 * - examples:     Array of example input/output objects (each required)
 * - test_cases:   Array of test cases; each has input/output object (required)
 * - solution:     Official solution code (optional)
 * - created_at:   Creation timestamp (auto-generated)
 * - lastModified_at: Last modified timestamp (auto-updated)
 */
const problemSchema = new mongoose.Schema({
  /** Problem name/title (must be unique across all problems) */
  title: {
    type: String,
    required: true,
  },
  /** Problem description in markdown or plain text */
  description: {
    type: String,
    required: true,
  },
  /** Starter/boilerplate code for the user */
  starter_code: {
    type: String,
    required: true,
  },
  /** Difficulty category */
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  /** Whether this problem is locked/premium-only */
  locked: {
    type: Boolean,
    default: false,
  },
  /** Example(s) for display; array of objects (input/output/explanation) */
  examples: [
    {
      type: Object,
      required: true,
    },
  ],
  /**
   * Test cases for evaluation.
   * Each item: { input: Object, output: Object }
   */
  test_cases: [
    {
      input: {
        type: Object,
        required: true,
      },
      output: {
        type: Object,
        required: true,
      },
    },
  ],
  /** Official solution (optional; not required for user exposure) */
  solution: {
    type: String,
  },
  /** Timestamp of creation (auto-set) */
  created_at: {
    type: Date,
    default: Date.now,
  },
  /** Timestamp of last modification (auto-updated on save) */
  lastModified_at: {
    type: Date,
    default: Date.now,
  },
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
