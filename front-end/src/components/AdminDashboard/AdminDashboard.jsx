import React, { useState, useEffect } from "react";
import "./admin-dashboard.scss";
import AdminProblemDistChart from "../Charts/AdminProblemDistChart";
import { useSelector } from "react-redux";
import axios from "axios";

const AdminDashboard = () => {
  const { problemList } = useSelector((state) => state);

  const [getAllSubmissions, setGetAllSubmissions] = useState([]);
  const [getAllUsers, setGetAllUsers] = useState([]);
  const [problemDistData, setProblemDistData] = useState([]);
  const [userFetchError, setUserFetchError] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/submissions`)
      .then((res) => setGetAllSubmissions(res.data.submissions || []))
      .catch((err) => console.log(err));

    let problemDist = { easy: 0, medium: 0, hard: 0 };
    problemList.forEach((problem) => {
      if (problem.difficulty === "Easy") problemDist.easy += 1;
      else if (problem.difficulty === "Medium") problemDist.medium += 1;
      else problemDist.hard += 1;
    });
    setProblemDistData([
      { name: "Easy", value: problemDist.easy },
      { name: "Medium", value: problemDist.medium },
      { name: "Hard", value: problemDist.hard },
    ]);

    // 3. Fetch users (requires admin JWT)
    const token = localStorage.getItem("jwtToken");
    axios
      .get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setGetAllUsers(res.data.users || []);
        setUserFetchError("");
      })
      .catch((err) => {
        setGetAllUsers([]);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setUserFetchError("Unauthorized: Please login as admin.");
        } else {
          setUserFetchError("Error fetching users.");
        }
      });
  }, [problemList]);

  return (
    <div className="ad-db-container">
      <div className="ad-db-b1">
        <div className="ad-db-b1a">
          <h3>Total Users</h3>
          <h1>{userFetchError ? "—" : getAllUsers.length}</h1>
        </div>
        <div className="ad-db-b1b">
          <h3>Total Problems</h3>
          <h1>{problemList.length}</h1>
        </div>
        <div className="ad-db-b1c">
          <h3>Total Submissions</h3>
          <h1>{getAllSubmissions.length}</h1>
        </div>
      </div>
      {userFetchError && <div className="ad-db-error">{userFetchError}</div>}
      <div className="ad-db-b2">
        <h3>Problem Distribution</h3>
        <div className="problem-dist-chart-container">
          <AdminProblemDistChart data={problemDistData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
