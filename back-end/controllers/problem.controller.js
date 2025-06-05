import Problem from "../models/problem/problem.js";
import * as problemService from "../services/problem.service.js";
import User from "../models/user/user.js";

export const createProblem = async (req, res, next) => {
  try {
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

    const problem = await problemService.createProblem(
      title,
      description,
      starter_code,
      difficulty,
      examples,
      test_cases,
      solution,
      locked,
    );
    if (problem) {
      res.status(201).json({ problem });
    }
  } catch (err) {
    console.log(err);
    if (err.message === "Problem already exists!") {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};

// Controller (problem.controller.js)
export const getProblems = async (req, res, next) => {
  try {
    console.log("REQ USER ID:", req.userId);
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // This passes user.user_status to your service
    const problemList = await problemService.getProblems(user.user_status);

    res.status(200).json({ problemList });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

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
      locked
    } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

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

export const deleteProblem = async (req, res, next) => {
  try {
    const problemId = req.params.id;

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


export const getProblemById = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

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
