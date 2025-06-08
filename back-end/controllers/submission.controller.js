import mongoose from "mongoose";
import Submission from "../models/submission/submission.js";
import User from "../models/user/user.js";
import Problem from "../models/problem/problem.js";

/**
 * Save a user submission to the database and attach it to the user.
 *
 * @param {Object} userData - User data object containing user._id.
 * @param {Object} problem - The problem object (_id required).
 * @param {string} code - User's submitted code.
 * @param {Object} results - Results object (contains results/status).
 * @returns {Promise<Object>} The saved Submission document.
 */
export const submission = async (userData, problem, code, results) => {
  try {
    const user = await User.findById(userData.user._id);

    // Create and save new submission
    const submission = new Submission({
      user: new mongoose.Types.ObjectId(userData.user._id),
      problem: new mongoose.Types.ObjectId(problem._id),
      language: "JavaScript",
      code: code,
      results: results.results,
      status: results.status,
    });
    await submission.save();

    // Link submission to user
    user.submisssions.push(submission);
    await user.save();

    return submission;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get all submissions by a user for a specific problem.
 *
 * @route GET /submissions/:userId/:problemId
 * @param {Object} req - Express request object (expects userId, problemId params)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} submissions - Array of submission documents
 */
export const getAllSubmission = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const problemId = req.params.problemId;
    const submissions = await Submission.find({
      user: new mongoose.Types.ObjectId(userId),
      problem: new mongoose.Types.ObjectId(problemId),
    }).exec();
    res.status(200).json({ submissions: submissions });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get all submissions from all users for all problems.
 *
 * @route GET /submissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} submissions - Array of all submission documents
 */
export const getAllSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({});
    return res.status(200).json({ submissions: submissions });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get unique problems solved by a user (based on their submissions).
 *
 * @route GET /submissions/solved/:userId
 * @param {Object} req - Express request object (expects userId param)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} results - Array of unique problem documents solved by the user
 */
export const getProblemsSolvedUnique = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(new mongoose.Types.ObjectId(userId));

    // Get all problem IDs from user's submissions
    let uniqueProblems = await Promise.all(
      user.submisssions.map(async (submission) => {
        let getSubmission = await Submission.findById(submission._id);
        return getSubmission?.problem.toString();
      })
    );
    const problemSet = new Set(uniqueProblems);

    // Retrieve full problem documents for each unique problem
    const problems = await Promise.all(
      Array.from(problemSet).map(async (problem) => {
        let returnProblem = await Problem.findById(problem);
        return returnProblem;
      })
    );

    res.status(200).json({
      results: problems,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get all submissions for a user, along with metadata about each submission and problem.
 *
 * @route GET /submissions/user/:userId/:problemId
 * @param {Object} req - Express request object (expects userId, problemId params)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} results - Array of objects: {problemName, submitted_at, language, difficulty, status}
 */
export const getAllUserSubmission = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const problemId = req.params.problemId;

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    let submissions = [];
    submissions = await Promise.all(
      user.submisssions.map(async (submission) => {
        let getSubmission = await Submission.findById(submission._id);
        let getProblem = await Problem.findById(getSubmission?.problem);

        return {
          problemName: getProblem.title,
          submitted_at: getSubmission.created_at,
          language: getSubmission.language,
          difficulty: getProblem.difficulty,
          status: getSubmission.status,
        };
      })
    );

    res.status(200).json({
      results: submissions,
    });
  } catch (error) {
    console.log(error);
  }
};
