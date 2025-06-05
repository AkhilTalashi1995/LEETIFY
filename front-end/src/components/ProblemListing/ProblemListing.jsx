import React, { useEffect, useState } from "react";
import ProblemListItem from "../ProblemListItem/ProblemListItem";
import { useSelector } from "react-redux";
import "./problem-listing.scss";
import { Pagination, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";

const PAGE_SIZE = 5;

function ProblemListing() {
  const problems = useSelector((state) => state.problemList);
  const [problemList, setProblemList] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!problems) return;

    if (selectedDifficulty === "All") {
      setProblemList(problems);
    } else {
      setProblemList(
        problems.filter((problem) => problem.difficulty === selectedDifficulty)
      );
    }
    setCurrentPage(1); // Reset page on filter change
  }, [problems, selectedDifficulty]);

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderData = () => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentData = problemList.slice(start, end);

    return currentData.map((problem) => (
      <div key={problem._id}>
        <ProblemListItem problem={problem} />
      </div>
    ));
  };

  return (
    <div className="problem-listing-container">
      {/* Featured Study Plans */}
      <h1 className="explore-content-h1">Featured</h1>
      <div className="featured-main-div">
        <div className="image-content-div">
          <Link to="/comingsoon">
            <img src="study-plan.png" alt="" className="featured-img-size" />
          </Link>
          <p className="featured-img-description">
            Leetify 75 Study Plan <br /> to Ace Interviews
          </p>
        </div>
        <div className="image-content-div">
          <Link to="/comingsoon">
            <img src="Algorithms.png" alt="" className="featured-img-size" />
          </Link>
          <p className="featured-img-description">
            14 Days Study Plan <br /> to Crack Algo
          </p>
        </div>
        <div className="image-content-div">
          <Link to="/comingsoon">
            <img
              src="data-structures.png"
              alt=""
              className="featured-img-size"
            />
          </Link>
          <p className="featured-img-description">
            2 Weeks Study Plan
            <br /> to Tackle DS
          </p>
        </div>
        <div className="image-content-div">
          <Link to="/comingsoon">
            <img src="sql.png" alt="" className="featured-img-size" />
          </Link>
          <p className="featured-img-description">SQL Study Plan</p>
        </div>
        <div className="image-content-div">
          <Link to="/comingsoon">
            <img
              src="programing-skill-plan.png"
              alt=""
              className="featured-img-size"
            />
          </Link>
          <p className="featured-img-description">Ultimate DP Study Plan</p>
        </div>
      </div>

      {/* Explore Problems Header */}
      <h1 className="explore-content-h1">Explore Problems</h1>
      <p className="explore-content">
        Discover a structured approach to programming advancement with Leetify's
        well-arranged difficulty-level problems, <br /> designed to optimize
        your progress towards the next level in your programming career.
      </p>

      {/* Difficulty Filter Tabs */}
      <div className="problem-cat-container">
        <div
          className={`problem-cat all ${
            selectedDifficulty === "All" ? "active" : ""
          }`}
          onClick={() => setSelectedDifficulty("All")}
        >
          <h3>All</h3>
        </div>
        <div
          className={`problem-cat easy ${
            selectedDifficulty === "Easy" ? "active" : ""
          }`}
          onClick={() => setSelectedDifficulty("Easy")}
        >
          <h3>Easy</h3>
        </div>
        <div
          className={`problem-cat medium ${
            selectedDifficulty === "Medium" ? "active" : ""
          }`}
          onClick={() => setSelectedDifficulty("Medium")}
        >
          <h3>Medium</h3>
        </div>
        <div
          className={`problem-cat hard ${
            selectedDifficulty === "Hard" ? "active" : ""
          }`}
          onClick={() => setSelectedDifficulty("Hard")}
        >
          <h3>Hard</h3>
        </div>
      </div>

      {/* Problems List */}
      <div className="problem-listing-space">
        {problemList ? (
          renderData()
        ) : (
          <Skeleton animation="wave" height={20} width="40%" />
        )}
      </div>
      <div className="problem-listing-page-bar">
        <Pagination
          count={Math.ceil(problemList.length / PAGE_SIZE)}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
        />
      </div>
    </div>
  );
}

export default ProblemListing;
