import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import ProblemListing from "../../components/ProblemListing/ProblemListing";
import axios from "axios";
import AdminPage from "../AdminPage/AdminPage";
// import other components as needed...

function UserHome() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Try Redux state first
    let token = state.userData?.token;

    // 2. Fallback: if Redux state is empty, check localStorage
    if (!token) {
      const persisted = localStorage.getItem("leetify_app_state");
      try {
        token = persisted ? JSON.parse(persisted)?.userData?.token : null;
      } catch (e) {
        token = null;
      }
    }

    // 3. If still no token, don't proceed
    if (!token) {
      console.error("No JWT token found. User is not authenticated.");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/problems`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch({ type: "SET_PROBLEM_LIST", payload: res.data.problemList });
        dispatch({ type: "RESET_SUBMISSION_STATUS" });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [dispatch, state.userData?.token]);

  // If user is admin, show admin page; else, show user content
  return (
    <>
      {state.userData.user?.user_status === "ADMIN" ? (
        <AdminPage />
      ) : (
        <>
          <Navbar />
          <ProblemListing />

          {/* <UserDetails /> */}
          {/* <AllUsers/> */}
          {/* <ProblemsSolvedByUser/> */}
          {/* <Submission/> */}
          {/* <LockedProblems/> */}
        </>
      )}
    </>
  );
}

export default UserHome;
