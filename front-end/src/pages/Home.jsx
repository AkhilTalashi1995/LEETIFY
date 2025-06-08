import React, { useState, useEffect } from "react";
import "./home.scss";
import { Link } from "react-router-dom";
import Footer from "./UserHome/Footer";
import LandingPageNavbar from "../components/LandingPageNavbar/LandingPageNavbar";
import CustomerReviews from "../components/CustomerReviews/CustomerReviews";

// Demo Modal Component
function DemoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="demo-modal-overlay" onClick={onClose}>
      <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="demo-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="demo-modal-video-container">
          <iframe
            src="https://www.youtube.com/embed/UlsqZqGAG1Q?autoplay=1"
            title="Project Walkthrough"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("demoVideoShown")) {
      setTimeout(() => setModalOpen(true), 700); // slight delay for UX
      sessionStorage.setItem("demoVideoShown", "1");
    }
  }, []);

  return (
    <>
      <LandingPageNavbar />

      {/* First Fold */}
      <div className="first-fold gradient">
        <div className="first-fold-img2">
          <img src="img-frn.png" alt="Foreground" />
        </div>
        <div className="first-fold-content">
          <h1>A New Way to Learn</h1>
          <p>
            Leetify is the best platform to help you enhance your skills, expand
            your knowledge and prepare for technical interviews.
          </p>
          <div className="first-fold-btns">
            <Link to="/signup">
              <button className="first-fold-content-button">
                Create Account
              </button>
            </Link>
            <button
              className="first-fold-demo-button"
              onClick={() => setModalOpen(true)}
            >
              <span className="youtube-icon" aria-label="YouTube">
                {/* YouTube Play SVG */}
                <svg height="20" viewBox="0 0 48 48" width="20">
                  <circle cx="24" cy="24" r="23" fill="#FF0000" />
                  <polygon points="20,16 36,24 20,32" fill="#fff" />
                </svg>
              </span>
              Project Demo
            </button>
          </div>
        </div>
      </div>

      {/* USP Section */}
      <div className="usp">
        <div className="usp-content">
          <div className="usp-content-img1">
            <img src="usp.png" alt="USP" className="section-icon" />
          </div>
          <h2 className="usp-heading">Why Choose Us?</h2>
          <p>
            <span>
              Great students deserve the best jobs,
              <br /> Leetify Makes it Happen...
            </span>
          </p>
          <div className="usp-flex">
            <div className="usp-box floating">
              <h1>
                Only the highest <br /> quality
              </h1>
              <p>
                Elevate Your Coding Skills to the Next Level with Leetify's
                Top-Quality, Industry-Standard Platform
              </p>
            </div>
            <div className="usp-box floating-1">
              <h1>
                Easy on the <br /> budget
              </h1>
              <p>
                Boost Your Coding Skills with Leetify's Affordable and Effective
                Online Platform
              </p>
            </div>
            <div className="usp-box floating-2">
              <h1>Does the job</h1>
              <p>
                Join the Ranks of Top Tech Talent: 150+ Students Have Secured
                Jobs in FAANG Companies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="dev">
        <div className="dev-content">
          <div className="dev-content-img1">
            <img src="dev.png" alt="Dev Icon" />
          </div>
          <h2>Developer</h2>
          <p>
            <span>
              We now support popular coding languages. At our core, Leetify is
              about developers. Our powerful development tools such as
              Playground help you test, debug and even write your own code
              online.
            </span>
          </p>
          <img
            src="Developer.png"
            alt="Developer Tools"
            className="dev-content-img2"
          />
        </div>
      </div>

      <CustomerReviews />
      <Footer />

      {/* Demo Modal */}
      <DemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default Home;
