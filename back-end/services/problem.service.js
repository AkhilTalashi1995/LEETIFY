import Problem from "../models/problem/index.js";

/**
 * Create a new coding problem in the database.
 *
 * @param {string} title - Problem title (must be unique)
 * @param {string} description - Problem description (markdown/text)
 * @param {string} starter_code - Starter/boilerplate code for user
 * @param {string} difficulty - Difficulty ("Easy", "Medium", "Hard")
 * @param {string|Object[]} examples - JSON string or array of example cases
 * @param {string|Object[]} test_cases - JSON string or array of test cases
 * @param {string} solution - Official solution code
 * @param {boolean} [locked=false] - Whether the problem is premium-locked
 * @returns {Promise<Object>} Created Problem document
 * @throws {Error} If problem with the same title already exists
 */
export const createProblem = async (
  title,
  description,
  starter_code,
  difficulty,
  examples,
  test_cases,
  solution,
  locked = false
) => {
  // Check for duplicate problem by title
  const existingProblem = await Problem.findOne({ title });
  if (existingProblem) {
    throw new Error("Problem already exists!");
  }

  // Ensure examples and test_cases are stored as arrays (parse if needed)
  const problem = new Problem({
    title: title,
    description: description,
    starter_code: starter_code,
    difficulty: difficulty,
    examples: typeof examples === "string" ? JSON.parse(examples) : examples,
    test_cases:
      typeof test_cases === "string" ? JSON.parse(test_cases) : test_cases,
    solution: solution,
    locked,
  });
  await problem.save();
  return problem;
};

/**
 * Retrieve all problems, applying access restrictions based on user status.
 * - For basic users, hides details of locked problems.
 * - For premium/admin users, returns all data.
 *
 * @param {string} user_status - The user's status ("USER", "PREMIUM_USER", "ADMIN")
 * @returns {Promise<Object[]>} Array of Problem documents (with restriction logic)
 */
export const getProblems = async (user_status) => {
  try {
    const allProblems = await Problem.find({});
    if (user_status === "USER") {
      // For regular users: mask locked problems
      return allProblems.map((p) =>
        p.locked
          ? {
              _id: p._id,
              title: p.title,
              locked: true,
              difficulty: p.difficulty,
            }
          : p
      );
    } else {
      // Premium/Admin: return full info
      return allProblems;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
