import Problem from "../models/problem/index.js";

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
  const existingProblem = await Problem.findOne({ title });
  if (existingProblem) {
    throw new Error("Problem already exists!");
  }

  console.log(description);
  console.log(typeof description);

  const problem = new Problem({
    title: title,
    description: description,
    starter_code: starter_code,
    difficulty: difficulty,
    examples: JSON.parse(examples),
    test_cases: JSON.parse(test_cases),
    solution: solution,
    locked,
  });
  await problem.save();
  return problem;
};

export const getProblems = async (user_status) => {
  try {
    const allProblems = await Problem.find({});
    if (user_status === "USER") {
      // Mask locked problems for USER
      return allProblems.map((p) =>
        p.locked
          ? {
              _id: p._id,
              title: p.title,
              locked: true,
              difficulty: p.difficulty, // include this!
            }
          : p
      );
    } else {
      // PREMIUM_USER or ADMIN: return all fields
      return allProblems;
    }
  } catch (error) {
    console.log(error);
    throw error; 
  }
};