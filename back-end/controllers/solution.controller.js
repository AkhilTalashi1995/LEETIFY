import * as solutionService from "../services/solution.service.js";
import * as submissionController from "./submission.controller.js";
import fs from "fs";
import spawn from "child_process";
import _ from "lodash";

export const solution = async (req, res, next) => {
  try {
    const { userData, problem, code } = req.body;
    const TIMEOUT = 20000; // 20 seconds

    fs.createWriteStream("code.js").write(JSON.parse(code));

    const runTestCase = (inputs, expectedOutput, testcaseInput) => {
      return new Promise((resolve, reject) => {
        const process = spawn.spawn("node", ["code.js", ...inputs]);
        let output = "";
        let errorOutput = "";

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

          // Better syntax/runtime error handling
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

          if (!output) {
            return resolve({
              input: testcaseInput,
              expectedOutput,
              output: null,
              isOutputMatched: false,
              error: "No output produced",
            });
          }

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

    const promises = problem.test_cases.map((test_case) => {
      let inputs = [];
      for (let key in test_case.input) {
        inputs.push(test_case.input[key]);
      }
      return runTestCase(inputs, test_case.output, test_case.input);
    });

    Promise.all(promises)
      .then((results) => {
        let status = "";
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

        let submissionPromise = userData
          ? submissionController.submission(userData, problem, code, {
              results,
              status,
            })
          : Promise.resolve(null);

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
