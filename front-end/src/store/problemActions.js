import axios from "axios";

export const fetchProblems = () => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/problems`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    dispatch({ type: "SET_PROBLEM_LIST", payload: res.data.problemList });
  } catch (err) {
    console.log("Fetch problems error:", err);
  }
};
