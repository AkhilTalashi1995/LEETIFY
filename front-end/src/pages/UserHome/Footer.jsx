import React from 'react';
import "./Footer.scss";

function Footer() {
  return (
    <footer className="leetify-footer">
      <div className="footer-top">
        <div className="footer-bridge">
          <img
            src="bridge.png"
            alt="Boston bridge"
            className="footer-bridge-img"
          />
        </div>
        <div className="footer-made-with">
          Made with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          in Boston
        </div>
        <div className="footer-mission">
          At Leetify, our mission is to help you improve yourself and land your
          dream job. We have a sizable repository of interview resources for
          many companies. In the past few years, our users have landed jobs at
          top companies around the world.
        </div>
      </div>
      <div className="footer-logos">
        {[
          { src: "facebook.svg", alt: "Facebook" },
          { src: "bank-of-america.svg", alt: "Bank of America" },
          { src: "apple.svg", alt: "Apple" },
          { src: "amazon.svg", alt: "Amazon" },
          { src: "cisco.svg", alt: "Cisco" },
          { src: "pinterest.svg", alt: "Pinterest" },
          { src: "uber.svg", alt: "Uber" },
          { src: "intel.svg", alt: "Intel" },
          { src: "stripe.svg", alt: "Stripe" },
          { src: "leap-motion.svg", alt: "Leap Motion" },
        ].map((logo, idx) => (
          <div className="footer-logo" key={idx}>
            <img src={logo.src} alt={logo.alt} />
          </div>
        ))}
      </div>
      <hr className="footer-divider" />
      <div className="footer-contact">
        If you are passionate about tackling some of the most interesting
        problems around, we would love to hear from you.
      </div>
    </footer>
  );
}

export default Footer;
