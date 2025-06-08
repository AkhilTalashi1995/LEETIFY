import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblems } from "../../store/problemActions";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
} from "@mui/material";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import "./update-problem.scss";

// --- Modal component, reused for update and delete success ---
function SuccessModal({ open, title, message, onClose }) {
  if (!open) return null;
  return (
    <div className="premium-modal-backdrop" onClick={onClose}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="premium-modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

// --- Confirmation modal for delete ---
function ConfirmDeleteModal({ open, problemName, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="premium-modal-backdrop" onClick={onCancel}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Are you sure?</h3>
        <p>
          Do you really want to delete <b>{problemName}</b>?<br />
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <button
            className="premium-modal-btn"
            style={{ background: "#232323", color: "#fff" }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="premium-modal-btn"
            style={{
              background: "linear-gradient(90deg, #ff6868, #f46b45)",
              color: "#222",
            }}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const UpdateProblem = () => {
  const dispatch = useDispatch();
  const problemList = useSelector((state) => state.problemList);

  const [selectedProblem, setSelectedProblem] = useState({});
  const [problemName, setProblemName] = useState("");
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const [showProblemEditSpace, setShowProblemEditSpace] = useState(false);
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
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch the problems on component mount
  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);

  // --- VALIDATION (Same as SetProblem) ---
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

  const handleSelectChange = (event) => {
    setProblemName(event.target.value);
    let prob = problemList.find(
      (problem) => problem.title === event.target.value
    );
    setSelectedProblem(prob);
    setFormData({
      problemName: prob.title,
      problemDescription: prob.description,
      starterCode: prob.starter_code,
      difficulty: prob.difficulty,
      examples: JSON.stringify(prob.examples, null, 2),
      testcases: JSON.stringify(prob.test_cases, null, 2),
      solution: prob.solution,
      locked: !!prob.locked,
    });
    setShowUpdateOptions(true);
  };

  const handleUpdateSpace = () => {
    setShowProblemEditSpace(true);
  };

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLockedChange = (event) => {
    setFormData({ ...formData, locked: event.target.checked });
  };

  const handleStarterCodeChange = (value) => {
    setFormData({ ...formData, starterCode: value });
  };

  const handleSolutionChange = (value) => {
    setFormData({ ...formData, solution: value });
  };

  const handleExamplesChange = (value) => {
    setFormData({ ...formData, examples: value });
  };

  const handleTestCasesChange = (value) => {
    setFormData({ ...formData, testcases: value });
  };

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
        .put(
          `${process.env.REACT_APP_API_URL}/problems/${selectedProblem._id}`,
          problemData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setShowProblemEditSpace(false);
          setShowUpdateOptions(false);
          setUpdateSuccess(true);
          setFormData({
            problemName: "",
            problemDescription: "",
            starterCode: "",
            difficulty: "Easy",
            examples: "",
            solution: "",
            testcases: "",
            locked: false,
          });
          // Fetch updated list after update
          dispatch(fetchProblems());
        })
        .catch((err) => {
          setErrors({ api: err?.response?.data?.message || "Update failed." });
        });
    }
  };

  // --- Delete, with confirmation popup ---
  const handleDeleteRequest = () => {
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = () => {
    setConfirmDelete(false);
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/problems/${selectedProblem._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      )
      .then((res) => {
        setShowUpdateOptions(false);
        setShowProblemEditSpace(false);
        setProblemName(""); // <-- Reset dropdown
        setSelectedProblem({}); // <-- Reset selected problem
        setDeleteSuccess(true);
        // Fetch updated list after delete
        dispatch(fetchProblems());
      })
      .catch((err) =>
        setErrors({ api: err?.response?.data?.message || "Delete failed." })
      );
  };

  return (
    <>
      <div className="up-cont">
        <div className="up-cont-b1">
          <h3>Update Problem</h3>
          <FormControl sx={{ m: 1, minWidth: 250, mt: 3 }}>
            <Select
              className="select-problem-dropdown"
              displayEmpty
              value={problemName}
              onChange={handleSelectChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (!selected) {
                  return <em>Select Problem</em>;
                }
                return selected;
              }}
              MenuProps={{
                PaperProps: {
                  className: "select-problem-dropdown-menu",
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                  },
                },
              }}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem disabled value="">
                <em>Select Problem</em>
              </MenuItem>
              {problemList.map((problem) => (
                <MenuItem key={problem._id} value={problem.title}>
                  {problem.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {showUpdateOptions && (
            <div className="up-cont-b3">
              <h3>Selected Problem: {problemName}</h3>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateSpace}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteRequest}
              >
                Delete
              </Button>
            </div>
          )}
          {showProblemEditSpace && (
            <>
              <div className="up-cont-b4">
                <div className="setproblem-container up-cont-fix2">
                  <div className="setproblem-content-container up-cont-fix1">
                    <form
                      className="setproblem-form"
                      onSubmit={handleFormSubmit}
                    >
                      {errors.api && (
                        <Alert severity="error">{errors.api}</Alert>
                      )}
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
                      <div
                        style={{
                          margin: "1rem 0 0.2rem 0",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="locked-checkbox"
                          checked={formData.locked}
                          onChange={handleLockedChange}
                          style={{
                            accentColor: "#fea116",
                            width: 22,
                            height: 22,
                            marginRight: 12,
                            cursor: "pointer",
                          }}
                        />
                        <label
                          htmlFor="locked-checkbox"
                          style={{
                            color: "#fea116",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: "1.08rem",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Locked (Premium Only)
                        </label>
                      </div>
                      <div className="setproblem-block-4">
                        <Button variant="contained" type="submit" fullWidth>
                          Submit
                        </Button>
                      </div>
                    </form>
                    <div className="increase-bottom-padding"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* --- Update Success Modal --- */}
      <SuccessModal
        open={updateSuccess}
        title="Problem Updated!"
        message={
          <span>
            <b>{formData.problemName || selectedProblem?.title}</b> was updated
            successfully.
          </span>
        }
        onClose={() => setUpdateSuccess(false)}
      />
      {/* --- Delete Success Modal --- */}
      <SuccessModal
        open={deleteSuccess}
        title="Problem Deleted!"
        message="The problem has been deleted."
        onClose={() => setDeleteSuccess(false)}
      />
      {/* --- Confirm Delete Modal --- */}
      <ConfirmDeleteModal
        open={confirmDelete}
        problemName={formData.problemName || selectedProblem?.title}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default UpdateProblem;
