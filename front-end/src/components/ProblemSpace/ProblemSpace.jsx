import React from "react";
import "./problem-space.scss";

const ProblemSpace = ({ selectedProblem }) => {
  return (
    <div className="problem-space-container">
      <h2>{selectedProblem.title}</h2>
      <h4>{selectedProblem.difficulty}</h4>
      <p>{selectedProblem.description}</p>
      {selectedProblem.examples && selectedProblem.examples.length > 0 && (
        <div style={{ width: "100%" }}>
          <h5 style={{ margin: "1.3rem 0 0.2rem 0", color: "#42535a" }}>
            Examples:
          </h5>
          {selectedProblem.examples.map((example, idx) => (
            <div className="example-block" key={idx}>
              {example.example}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemSpace;
