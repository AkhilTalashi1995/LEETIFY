import * as solutionService from "../services/solution.service.js";
import * as submissionController from "./submission.controller.js";
import fs from "fs";
import spawn from "child_process";
import _ from "lodash";

/**
 * Runs user-submitted code against all test cases for a given problem.
 * - Writes code to a file, executes it for each test case, compares outputs.
 * - Collects results, handles timeouts, syntax/runtime errors.
 * - Records submission if user is logged in.
 *
 * @route POST /solution
 * @param {Object} req - Express request object, expects { userData, problem, code } in body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} JSON containing results, status, and optional submission.
 */
export const solution = async (req, res, next) => {
  try {
    const { userData, problem, code } = req.body;
    const TIMEOUT = 20000; // 20 seconds for each test case

    // Save submitted code as a local JS file
    fs.createWriteStream("code.js").write(JSON.parse(code));

    /**
     * Executes code.js using Node, passes test inputs, captures output.
     * Handles timeout, errors, and output parsing.
     *
     * @param {Array} inputs - Input values for the test case
     * @param {any} expectedOutput - Expected output for the test case
     * @param {Object} testcaseInput - The full test case input object (for result reporting)
     * @returns {Promise<Object>} Test result with status and error info
     */
    const runTestCase = (inputs, expectedOutput, testcaseInput) => {
      return new Promise((resolve, reject) => {
        // Spawn child process for code execution
        const process = spawn.spawn("node", ["code.js", ...inputs]);
        let output = "";
        let errorOutput = "";

        // Kill process if it exceeds TIMEOUT
        const timeoutId = setTimeout(() => {
          process.kill();
          resolve({
            input: testcaseInput,
            expectedOutput,
            output: null,
            isOutputMatched: false,
            error: "Timeout exceeded",
          });
        }, TIMEOUT);

        process.stdout.on("data", (data) => {
          output += data;
        });

        process.stderr.on("data", (data) => {
          errorOutput += data;
        });

        process.on("exit", (code) => {
          clearTimeout(timeoutId);

          // Detect syntax/runtime errors
          if (code !== 0 || errorOutput) {
            let errorMsg = errorOutput || "Runtime/Syntax error";
            if (/SyntaxError:/i.test(errorMsg)) {
              errorMsg = "Syntax Error: " + errorMsg;
            }
            return resolve({
              input: testcaseInput,
              expectedOutput,
              output: null,
              isOutputMatched: false,
              error: errorMsg,
            });
          }

          // Detect if no output was produced
          if (!output) {
            return resolve({
              input: testcaseInput,
              expectedOutput,
              output: null,
              isOutputMatched: false,
              error: "No output produced",
            });
          }

          // Parse output as JSON (expected for problem auto-judge)
          let parsedOutput;
          try {
            parsedOutput = JSON.parse(output.toString().replace("\n", ""));
          } catch (e) {
            return resolve({
              input: testcaseInput,
              expectedOutput,
              output: output.toString(),
              isOutputMatched: false,
              error: "Output is not valid JSON: " + output.toString(),
            });
          }

          // Deep equality check for expected vs actual output
          const isOutputMatched = _.isEqual(expectedOutput, parsedOutput);
          resolve({
            input: testcaseInput,
            expectedOutput,
            output: parsedOutput,
            isOutputMatched,
            error: null,
          });
        });
      });
    };

    // Run all test cases in parallel
    const promises = problem.test_cases.map((test_case) => {
      let inputs = [];
      for (let key in test_case.input) {
        inputs.push(test_case.input[key]);
      }
      return runTestCase(inputs, test_case.output, test_case.input);
    });

    // Aggregate all results, determine verdict, and record submission
    Promise.all(promises)
      .then((results) => {
        let status = "";
        // Detect fatal errors in any test case
        let hasFatalError = results.some(
          (result) =>
            result.error &&
            (result.error.includes("Syntax Error") ||
              result.error.includes("Timeout") ||
              result.error.includes("No output produced") ||
              result.error.includes("Runtime") ||
              result.error.includes("Output is not valid JSON"))
        );

        if (hasFatalError) {
          status = "Error";
        } else if (results.every((result) => result.isOutputMatched)) {
          status = "Accepted";
        } else {
          status = "Wrong Answer";
        }

        // If user is authenticated, save submission
        let submissionPromise = userData
          ? submissionController.submission(userData, problem, code, {
              results,
              status,
            })
          : Promise.resolve(null);

        // Send result and status to client
        submissionPromise.then((value) =>
          res.status(200).json({
            results: results,
            status: status,
            submission: value,
          })
        );
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error.message);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
