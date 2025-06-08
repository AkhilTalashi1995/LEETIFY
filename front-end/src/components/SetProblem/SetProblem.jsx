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
  Alert,
} from "@mui/material";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import axios from "axios";

// --- Success Modal (styled like PremiumSubCard modal) ---
function SuccessModal({ open, problemName, onClose }) {
  if (!open) return null;
  return (
    <div className="premium-modal-backdrop" onClick={onClose}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Problem Submitted!</h3>
        <p>
          <b>{problemName}</b> has been added to your problems list.
        </p>
        <button className="premium-modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

const SetProblem = () => {
  const [formData, setFormData] = useState({
    problemName: "",
    problemDescription: "",
    starterCode: "",
    difficulty: "Easy",
    examples: "",
    testcases: "",
    solution: "",
    locked: false,
  });

  const [errors, setErrors] = useState({});
  const [successPopup, setSuccessPopup] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState("");

  // Validation logic
  const validate = () => {
    const err = {};
    if (!formData.problemName.trim())
      err.problemName = "Problem Name is required";
    if (!formData.problemDescription.trim())
      err.problemDescription = "Description is required";
    if (!formData.starterCode.trim())
      err.starterCode = "Starter Code is required";
    if (!formData.examples.trim()) err.examples = "Examples are required";
    if (!formData.testcases.trim()) err.testcases = "Test Cases are required";
    // Validate JSON for examples & testcases
    try {
      if (formData.examples.trim()) JSON.parse(formData.examples);
    } catch {
      err.examples = "Examples must be valid JSON";
    }
    try {
      if (formData.testcases.trim()) JSON.parse(formData.testcases);
    } catch {
      err.testcases = "Test Cases must be valid JSON";
    }
    return err;
  };

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

  // Optional: You can use this if you want to know who created the problem
  // const { userData } = useSelector((state) => state.userData);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      let problemData = {
        title: formData.problemName.trim(),
        description: formData.problemDescription.trim(),
        starter_code: formData.starterCode,
        difficulty: formData.difficulty,
        examples: formData.examples,
        test_cases: formData.testcases,
        solution: formData.solution,
        locked: formData.locked,
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/problems`, problemData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setSubmittedProblem(formData.problemName.trim());
          setSuccessPopup(true);
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
          setErrors({
            api: err?.response?.data?.message || "Submission failed.",
          });
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
            {errors.api && <Alert severity="error">{errors.api}</Alert>}

            <div className="setproblem-block-1">
              <div className="setproblem-block-1a">
                <TextField
                  id="outlined-basic"
                  label="Problem Name"
                  name="problemName"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.problemName}
                  helperText={errors.problemName}
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
                  error={!!errors.problemDescription}
                  helperText={errors.problemDescription}
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
                {errors.starterCode && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.92rem",
                      marginTop: "4px",
                    }}
                  >
                    {errors.starterCode}
                  </div>
                )}
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
                  {errors.examples && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "0.92rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.examples}
                    </div>
                  )}
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
                  {errors.testcases && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "0.92rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.testcases}
                    </div>
                  )}
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
            {/* Locked Checkbox */}
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
      {/* --- Modern Modal Popup --- */}
      <SuccessModal
        open={successPopup}
        problemName={submittedProblem}
        onClose={() => setSuccessPopup(false)}
      />
    </>
  );
};

export default SetProblem;
