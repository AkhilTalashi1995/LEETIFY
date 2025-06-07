import React, { useState } from "react";
import "./landingpagenavbar.scss";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Premium", path: "/PremiumPage", className: "premium" },
  { label: "Sign in", path: "/signin" },
  { label: "Sign up", path: "/signup" },
];

function LandingPageNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="header-section">
      <div className="header-nav">
        <a href="/Home" className="brand-link">
          <img src="logo-main.png" alt="leetify-logo" width="45" height="45" />
          <span className="brand-name">Leetify</span>
        </a>

        {/* Desktop nav */}
        <nav className="nav-links desktop-nav">
          {NAV_LINKS.map((nav, i) =>
            nav.path.startsWith("/signup") ? (
              <NavLink to={nav.path} key={i} className={nav.className}>
                <span className={nav.className}>{nav.label}</span>
              </NavLink>
            ) : (
              <a href={nav.path} key={i}>
                <span className={nav.className}>{nav.label}</span>
              </a>
            )
          )}
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

      {/* Mobile menu (overlay + drawer) */}
      <div
        className={`mobile-nav-overlay ${mobileOpen ? "open" : ""}`}
        onClick={closeMenu}
      ></div>
      <nav className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`}>
        <button
          className="mobile-nav-close"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          &times;
        </button>
        <div className="mobile-brand-logo">
          <img src="logo-main.png" alt="leetify-logo" width={45} height={45} />
          <span className="brand-name">Leetify</span>
        </div>
        <div className="mobile-nav-links">
          {NAV_LINKS.map((nav, i) => (
            <NavLink
              to={nav.path}
              key={i}
              className={({ isActive }) =>
                `${nav.className || ""} mobile-nav-link${
                  isActive ? " active-link" : ""
                }`
              }
              onClick={closeMenu}
            >
              <span className={nav.className || ""}>{nav.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default LandingPageNavbar;
