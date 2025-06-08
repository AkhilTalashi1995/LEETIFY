import mongoose from "mongoose";

/**
 * Submission Schema - Represents a user's submission for a coding problem.
 *
 * Fields:
 * - user:       Reference to the submitting User (required)
 * - problem:    Reference to the associated Problem (required)
 * - language:   Programming language used for the submission (required)
 * - code:       Submitted code (string, required)
 * - results:    Judging results (object, structure defined by your judge logic, required)
 * - status:     Final verdict; one of "Accepted", "Wrong Answer", "Time Limit Exceeded", or "Runtime Error" (required)
 * - created_at: Timestamp of submission (auto-generated)
 */
const submissionSchema = new mongoose.Schema({
  /** Reference to the submitting user */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  /** Reference to the problem being solved */
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  /** Programming language used (e.g., "JavaScript", "Python") */
  language: {
    type: String,
    required: true,
  },
  /** Submitted source code */
  code: {
    type: String,
    required: true,
  },
  /** Results object (as returned by your code judge, typically an array of test results) */
  results: {
    type: Object,
    required: true,
  },
  /**
   * Status of the submission:
   * - "Accepted": All test cases passed
   * - "Wrong Answer": At least one test case failed
   * - "Time Limit Exceeded": Did not complete within allowed time
   * - "Runtime Error": Code threw an exception or error
   */
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"],
    required: true,
  },
  /** Timestamp when the submission was made */
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
