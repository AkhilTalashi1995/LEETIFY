import { StyledEngineProvider } from "@mui/styled-engine-sc";
import React, { useState } from "react";
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard";
import SetProblem from "../../components/SetProblem/SetProblem";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import UpdateProblem from "../../components/UpdateProblem/UpdateProblem";
import "./admin-page.scss";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <StyledEngineProvider injectFirst>
      <AdminNavbar activeTab={activeTab} onTabClick={setActiveTab} />
      <main className="admin-page-main">
        <div className="admin-page-content">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "setProblem" && <SetProblem />}
          {activeTab === "updateProblem" && <UpdateProblem />}
          
        </div>
      </main>
    </StyledEngineProvider>
  );
};

export default AdminPage;
