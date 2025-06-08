import Problem from "../models/problem/problem.js";
import * as problemService from "../services/problem.service.js";
import User from "../models/user/user.js";

/**
 * Create a new coding problem.
 *
 * @route POST /problems
 * @param {Object} req - Express request object containing problem details in body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} JSON response with created problem or error message.
 */
export const createProblem = async (req, res, next) => {
  try {
    // Extract problem details from request body
    const {
      title,
      description,
      starter_code,
      difficulty,
      examples,
      test_cases,
      solution,
      locked,
    } = req.body;

    // Delegate creation logic to service layer
    const problem = await problemService.createProblem(
      title,
      description,
      starter_code,
      difficulty,
      examples,
      test_cases,
      solution,
      locked
    );
    if (problem) {
      // Success: send created problem in response
      res.status(201).json({ problem });
    }
  } catch (err) {
    console.log(err);
    // Handle duplicate problem case
    if (err.message === "Problem already exists!") {
      return res.status(409).json({ message: err.message });
    }
    // Handle other server errors
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get all coding problems for the authenticated user.
 *
 * @route GET /problems
 * @param {Object} req - Express request object; req.userId must be set by auth middleware.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} JSON response with a list of problems.
 */
export const getProblems = async (req, res, next) => {
  try {
    console.log("REQ USER ID:", req.userId);

    // Ensure user exists and is authenticated
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch problems based on user status (e.g., premium or not)
    const problemList = await problemService.getProblems(user.user_status);

    res.status(200).json({ problemList });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Update a coding problem by its ID.
 *
 * @route PUT /problems/:id
 * @param {Object} req - Express request object with updated problem details in body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} JSON response with updated problem or error message.
 */
export const updateProblem = async (req, res, next) => {
  try {
    const problemId = req.params.id;
    console.log(problemId);

    const {
      title,
      description,
      starter_code,
      difficulty,
      examples,
      test_cases,
      solution,
      locked,
    } = req.body;

    // Find problem by ID
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Update problem fields
    problem.title = title;
    problem.description = description;
    problem.starter_code = starter_code;
    problem.difficulty = difficulty;
    problem.examples = JSON.parse(examples);
    problem.test_cases = JSON.parse(test_cases);
    problem.solution = solution;
    problem.locked = locked;
    problem.lastModified_at = Date.now();

    await problem.save();

    res.json(problem);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete a coding problem by its ID.
 *
 * @route DELETE /problems/:id
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} JSON response with deletion confirmation or error message.
 */
export const deleteProblem = async (req, res, next) => {
  try {
    const problemId = req.params.id;

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    await Problem.deleteOne({ _id: problemId });

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get a single coding problem by its ID with access control.
 *
 * @route GET /problems/:id
 * @param {Object} req - Express request object; req.userId must be set by auth middleware.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} JSON response with the problem or an error/access message.
 */
export const getProblemById = async (req, res, next) => {
  try {
    // Find current user and problem
    const user = await User.findById(req.userId);
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Enforce premium access for locked problems
    if (problem.locked && user.user_status === "USER") {
      return res
        .status(403)
        .json({ message: "This problem is for premium users only." });
    }

    res.status(200).json({ problem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
