import React, { useState } from "react";
import "./navbar.scss";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const NAV_LINKS = [
  { label: "Premium", path: "/innerpremiumpage", className: "premium" },
  { label: "Problems", path: "/home" },
];

function Navbar() {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // For mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // Avatar menu (desktop only)
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Logout etc.
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("jwtToken");
    navigate("/");
    setAnchorEl(null);
    setMobileOpen(false);
  };
  const handleDashboard = () => {
    navigate("/userDashboard");
    setAnchorEl(null);
    setMobileOpen(false);
  };
  const handleProfile = () => {
    navigate("/userprofile");
    setAnchorEl(null);
    setMobileOpen(false);
  };

  return (
    <header className="header-section">
      <div className="header-nav">
        <Link to="/home" className="brand-link">
          <img src="/logo-main.png" alt="leetify-logo" width="45" height="45" />
          <span className="brand-name">Leetify</span>
        </Link>
        <nav className="nav-links desktop-nav">
          {NAV_LINKS.map((nav, i) => (
            <Link to={nav.path} key={i}>
              <span className={nav.className}>{nav.label}</span>
            </Link>
          ))}
          <div>
            <Button
              id="avatar-menu-btn"
              aria-controls={open ? "avatar-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className="avatar-btn"
            >
              <Avatar className="avatar">
                {userData?.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </Button>
            <Menu
              id="avatar-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "avatar-menu-btn",
              }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </nav>
        {/* Hamburger menu for mobile */}
        {!mobileOpen && (
          <button
            className="nav-hamburger"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </div>
      {/* Mobile overlay + drawer */}
      <div
        className={`mobile-nav-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      ></div>
      <nav className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`}>
        <button
          className="mobile-nav-close"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          &times;
        </button>
        <div className="mobile-brand-logo">
          <img src="/logo-main.png" alt="leetify-logo" width={40} height={40} />
          <span className="brand-name">Leetify</span>
        </div>
        <div className="mobile-nav-links">
          {NAV_LINKS.map((nav, i) => (
            <Link
              to={nav.path}
              key={i}
              className={nav.className}
              onClick={() => setMobileOpen(false)}
            >
              <span className={nav.className}>{nav.label}</span>
            </Link>
          ))}
          {/* Profile, Dashboard, Logout as plain buttons */}
          <button className="mobile-menu-btn" onClick={handleProfile}>
            Profile
          </button>
          <button className="mobile-menu-btn" onClick={handleDashboard}>
            Dashboard
          </button>
          <button className="mobile-menu-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
