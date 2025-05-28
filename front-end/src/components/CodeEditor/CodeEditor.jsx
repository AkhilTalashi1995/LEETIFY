import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Skeleton,
  StyledEngineProvider,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import SubmitResult from "../SubmitResult/SubmitResult";
import "./code-editor.scss";

const CodeEditor = () => {
  const state = useSelector((state) => state);
  const [editorCodeValue, seteditorCodeValue] = useState("");
  const [runResults, setRunResults] = useState("");
  const [submitResults, setSubmitResults] = useState({});
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);
  const [showRunResults, setShowRunResults] = useState(false);
  const [showSubmitResults, setShowSubmitResults] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    seteditorCodeValue(state.selectedProblem.starter_code);
  }, [state.selectedProblem.starter_code]);

  function onChange(newValue) {
    seteditorCodeValue(newValue);
  }

  function handleRun() {
    setShowRunResults(true);
    setShowSubmitResults(false);
    setShouldShowSkeleton(true);
    const data = {
      problem: state.selectedProblem,
      code: JSON.stringify(editorCodeValue),
    };
    axios
      .post("https://leetify-backend.vercel.app/solutions", data)
      .then((res) => {
        setRunResults(res.data.result);
        setShouldShowSkeleton(false);
      })
      .catch((err) => {
        setShouldShowSkeleton(false);
      });
  }

  function handleSubmit() {
    setShowRunResults(false);
    setShouldShowSkeleton(true);
    const data = {
      userData: state.userData,
      problem: state.selectedProblem,
      code: JSON.stringify(editorCodeValue),
    };
    axios
      .post("https://leetify-backend.vercel.app/solutions", data)
      .then((res) => {
        setSubmitResults(res.data);
        setShowSubmitResults(true);
        setShouldShowSkeleton(false);
        if (res.data.status === "Accepted") {
          dispatch({ type: "ACCEPTED_SUBMISSION_STATUS" });
        }
      })
      .catch((err) => {
        setShouldShowSkeleton(false);
      });
  }

  return (
    <StyledEngineProvider injectFirst>
      <div className="code-editor-panel">
        <h3 className="code-editor-heading">
          {state.problemSubmissionStatus ? "Submission" : "Code"}
        </h3>
        <div className="editor-monaco">
          <Editor
            height="400px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={editorCodeValue}
            onChange={onChange}
            options={{
              fontSize: 15,
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
            }}
          />
        </div>
        <div className="editor-bottom-container">
          <h3 className="heading-results">Results</h3>
          <div className="problem-action-buttons">
            <Button variant="contained" className="btn-run" onClick={handleRun}>
              Run
            </Button>
            <Button
              variant="contained"
              className="btn-submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
        <Container className="results-container">
          {showRunResults ? (
            runResults ? (
              <div>
                <h3>{runResults}</h3>
              </div>
            ) : shouldShowSkeleton ? (
              <>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </>
            ) : (
              ""
            )
          ) : showSubmitResults ? (
            <SubmitResult
              problem={state.selectedProblem}
              results={submitResults}
              showingSubmittedCode={false}
            />
          ) : shouldShowSkeleton ? (
            <>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </>
          ) : (
            ""
          )}
        </Container>
      </div>
    </StyledEngineProvider>
  );
};

export default CodeEditor;
