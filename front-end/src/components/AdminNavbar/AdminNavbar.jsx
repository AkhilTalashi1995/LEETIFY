import React from "react";
import "./admin-navbar.scss";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const NAV_LINKS = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Set Problem", key: "setProblem" },
  { label: "Update Problem", key: "updateProblem" },
  { label: "All Users", key: "allUsers" },
];

const AdminNavbar = ({ activeTab, onTabClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setAnchorEl(null);
    setMobileOpen(false);
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <header className="admin-header-section">
      <div className="admin-header-nav">
        <a href="/Home" className="admin-brand-link">
          <img src="logo-main.png" alt="leetify-logo" width="45" height="45" />
          <span className="admin-brand-name">Leetify Admin</span>
        </a>

        {/* Desktop nav */}
        <nav className="admin-nav-links desktop-nav">
          {NAV_LINKS.map((nav) => (
            <button
              key={nav.key}
              className={
                "admin-nav-link-btn" + (activeTab === nav.key ? " active" : "")
              }
              onClick={() => onTabClick(nav.key)}
            >
              {nav.label}
            </button>
          ))}
          <Avatar
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            style={{ cursor: "pointer", marginLeft: 16 }}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </nav>

        {/* Hamburger menu for mobile - only visible when closed */}
        {!mobileOpen && (
          <button
            className="admin-nav-hamburger"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`admin-mobile-nav-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <nav
        className={`admin-mobile-nav-drawer ${mobileOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {mobileOpen && (
          <button
            className="admin-mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            &times;
          </button>
        )}
        <div className="admin-mobile-brand-logo">
          <img src="logo-main.png" alt="leetify-logo" width={40} height={40} />
          <span className="admin-brand-name">Leetify Admin</span>
        </div>
        <div className="admin-mobile-nav-links">
          {NAV_LINKS.map((nav) => (
            <button
              key={nav.key}
              className={
                "admin-mobile-nav-link-btn" +
                (activeTab === nav.key ? " active" : "")
              }
              onClick={() => {
                onTabClick(nav.key);
                setMobileOpen(false);
              }}
            >
              {nav.label}
            </button>
          ))}
        </div>
        {/* Logout at the bottom */}
        <div className="admin-mobile-logout-btn-wrapper">
          <button onClick={handleLogout} className="admin-mobile-logout-btn">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
