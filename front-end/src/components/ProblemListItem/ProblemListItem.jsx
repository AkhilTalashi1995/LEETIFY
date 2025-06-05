import React from "react";
import "./problem-list-item.scss";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";

function ProblemListItem({ problem }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStatus = useSelector((state) => state.userData?.user?.user_status);

  const isLocked = !!problem.locked;
  const isPremium = userStatus === "PREMIUM_USER" || userStatus === "ADMIN";

  // Show locked, blurred, not clickable for normal user
  if (isLocked && !isPremium) {
    return (
      <Tooltip title="Unlock with Premium" arrow placement="right">
        <div className="problem-link">
          <div className="problem-list-item-container locked-blur">
            <FontAwesomeIcon icon={faLock} className="lock-icon" />
            <h3 className="blurred-title">{problem.title}</h3>
            {problem.difficulty && (
              <span className="difficulty-badge">{problem.difficulty}</span>
            )}
          </div>
        </div>
      </Tooltip>
    );
  }

  // Unlocked or premium, normal link
  return (
    <Link
      to={`/problems/${problem.title}`}
      className="problem-link"
      onClick={() =>
        dispatch({ type: "SET_SELECTED_PROBLEM", payload: problem })
      }
    >
      <div className="problem-list-item-container">
        <h3>{problem.title}</h3>
        {problem.difficulty && (
          <span className="difficulty-badge">{problem.difficulty}</span>
        )}
      </div>
    </Link>
  );
}

export default ProblemListItem;
