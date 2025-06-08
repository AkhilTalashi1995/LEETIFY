import axios from "axios";

/**
 * Async Redux thunk to fetch the list of problems from the backend API.
 * Dispatches the result to update the Redux state.
 * Automatically includes the user's JWT from localStorage.
 *
 * @returns {Function} Thunk function for Redux dispatch
 *
 * Usage: dispatch(fetchProblems());
 */
export const fetchProblems = () => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/problems`, {
      headers: {
        // Attach Bearer token for authentication
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    // On success, update Redux state with problem list
    dispatch({ type: "SET_PROBLEM_LIST", payload: res.data.problemList });
  } catch (err) {
    // Log error for debugging
    console.log("Fetch problems error:", err);
  }
};
