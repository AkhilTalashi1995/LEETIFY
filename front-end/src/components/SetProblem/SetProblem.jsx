import React, { useState } from "react";
import "./set-problem.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import axios from "axios";

const SetProblem = () => {
  const [formData, setFormData] = useState({
    problemName: "",
    problemDescription: "",
    starterCode: "",
    difficulty: "Easy",
    examples: "",
    testcases: "",
    solution: "",
    locked: false, // <---- add locked field
  });

  const handleFormDataChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleStarterCodeChange = (editorValue) => {
    setFormData({ ...formData, starterCode: editorValue });
  };
  const handleSolutionChange = (editorValue) => {
    setFormData({ ...formData, solution: editorValue });
  };
  const handleExamplesChange = (editorValue) => {
    setFormData({ ...formData, examples: editorValue });
  };
  const handleTestCasesChange = (editorValue) => {
    setFormData({ ...formData, testcases: editorValue });
  };

  const { userData } = useSelector((state) => state.userData);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (formData.starterCode && formData.examples && formData.testcases) {
      let problemData = {
        title: formData.problemName,
        description: formData.problemDescription,
        starter_code: formData.starterCode,
        difficulty: formData.difficulty,
        examples: formData.examples,
        test_cases: formData.testcases,
        solution: formData.solution,
        locked: formData.locked, // <--- include locked
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/problems`, problemData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setFormData({
            problemName: "",
            problemDescription: "",
            starterCode: "",
            difficulty: "Easy",
            examples: "",
            testcases: "",
            solution: "",
            locked: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="setproblem-container">
        <div className="setproblem-nav">
          <h3>Set Problem</h3>
        </div>
        <div className="setproblem-content-container">
          <form className="setproblem-form" onSubmit={handleFormSubmit}>
            <div className="setproblem-block-1">
              <div className="setproblem-block-1a">
                <TextField
                  id="outlined-basic"
                  label="Problem Name"
                  name="problemName"
                  variant="outlined"
                  fullWidth
                  required
                  style={{ marginBottom: "1rem" }}
                  value={formData.problemName}
                  onChange={handleFormDataChange}
                />
                <TextField
                  id="outlined-basic"
                  label="Problem Description"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={18}
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="setproblem-block-1b">
                <h4>Starter Code</h4>
                <Editor
                  height="480px"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={formData.starterCode}
                  onChange={handleStarterCodeChange}
                  options={{
                    fontSize: 15,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>
            <div className="setproblem-block-2">
              <FormControl>
                <InputLabel id="demo-simple-select-label">
                  Difficulty
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.difficulty}
                  label="Difficulty"
                  onChange={handleFormDataChange}
                  name="difficulty"
                  required
                  style={{ width: "33.5rem" }}
                >
                  <MenuItem value={"Easy"}>Easy</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                  <MenuItem value={"Hard"}>Hard</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="setproblem-block-3">
              <div className="setproblem-block-3a">
                <div className="setproblem-examples">
                  <h4>Examples</h4>
                </div>
                <div className="setproblem-examples-div">
                  <Editor
                    height="300px"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={formData.examples}
                    onChange={handleExamplesChange}
                    options={{
                      fontSize: 15,
                      wordWrap: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                    }}
                    className="test-case-editor"
                  />
                </div>
              </div>
              <div className="setproblem-block-3b">
                <div className="setproblem-examples">
                  <h4>Test Cases</h4>
                </div>
                <div className="setproblem-examples-div">
                  <Editor
                    height="300px"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={formData.testcases}
                    onChange={handleTestCasesChange}
                    options={{
                      fontSize: 15,
                      wordWrap: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                    }}
                    className="test-case-editor"
                  />
                </div>
              </div>
            </div>
            <div className="setproblem-block-4">
              <div className="setproblem-block-4a">
                <h4>Solution</h4>
                <Editor
                  height="480px"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={formData.solution}
                  onChange={handleSolutionChange}
                  options={{
                    fontSize: 15,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>
            {/* --- Add Locked Checkbox here, just above the submit button --- */}
            <FormControlLabel
              control={
                <Checkbox
                  name="locked"
                  checked={formData.locked}
                  onChange={handleFormDataChange}
                  color="warning"
                />
              }
              label={
                <span style={{ color: "#ed932c", fontWeight: 500 }}>
                  Locked (Premium Only)
                </span>
              }
              style={{ margin: "0.6rem 0 0.8rem 0" }}
            />
            <div className="setproblem-block-4">
              <Button variant="contained" type="submit" fullWidth>
                Submit
              </Button>
            </div>
          </form>
          <div className="increase-bottom-padding"></div>
        </div>
      </div>
    </>
  );
};

export default SetProblem;
