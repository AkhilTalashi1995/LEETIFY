import Problem from "../models/problem/index.js";
import fs from "fs";
import spawn from "child_process";

/**
 * Executes and checks a solution for a coding problem.
 * - Writes the submitted code to disk.
 * - Compiles and runs the code using Node.js.
 * - Compares program output to the expected output for the first test case.
 * - Logs compilation/execution results.
 *
 * @param {Object} problem - The problem document (must include test_cases)
 * @param {string} code - User's submitted code (JSON-encoded string)
 * @returns {Promise<string>} Output of the code execution (as string)
 */
export const solution = async (problem, code) => {
  try {
    // Write submitted code to code.js
    fs.createWriteStream("code.js").write(JSON.parse(code));

    // Attempt to compile the JS file to catch syntax errors (node -c)
    const compilationCheck = spawn.spawn("node", ["-c", "code.js"]);

    compilationCheck.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    compilationCheck.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    compilationCheck.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });

    // Run the code with the first test case's inputs
    const process = spawn.spawn("node", [
      "code.js",
      problem.test_cases[0].input.nums,
      problem.test_cases[0].input.target,
    ]);

    let output = "";

    // Capture stdout (program output)
    process.stdout.on("data", (data) => {
      console.log("here");
      console.log(`stdout: ${data}`);
      output = data;
    });

    // Capture stderr (runtime errors)
    process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // After program finishes, compare output to expected
    process.on("exit", (code) => {
      console.log(`child process exited with code ${code}`);
      console.log(`Output: ${output}`);
      console.log(output.toString());
      console.log(
        typeof problem.test_cases[0].output,
        typeof output.toString()
      );
      console.log(problem.test_cases[0].output.toString(), output.toString());
      if (problem.test_cases[0].output.toString().match(output.toString())) {
        console.log("output matched");
      } else {
        console.log("not matched");
      }
    });

    // Return output as string
    return output.toString();
  } catch (error) {
    console.log(error);
  }
};
