import React, { useState } from "react";
import "./Premium-Sub-Card.scss";

function PremiumSubCard() {
  // Modal state
  const [modal, setModal] = useState({ open: false, plan: "" });

  // Modern Popup
  function PopupModal({ open, plan, onClose }) {
    if (!open) return null;
    return (
      <div className="premium-modal-backdrop" onClick={onClose}>
        <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
          <h3>Sign In Required</h3>
          <p>
            {plan === "monthly"
              ? "Please create an account or sign in to subscribe to our Monthly Plan."
              : "Please create an account or sign in to subscribe to our Yearly Plan."}
          </p>
          <button className="premium-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="subscription-card">
        {/* Monthly Card */}
        <div className="sub-card monthly">
          <div className="sub-card-header">
            <span className="sub-card-title">Monthly</span>
            <span className="sub-card-billing">billed monthly</span>
          </div>
          <div className="sub-card-desc">
            <strong>Down from $39/month.</strong>
            <br />
            <span>
              Our monthly plan grants access to{" "}
              <strong>all premium features</strong>, the best plan for
              short-term subscribers.
            </span>
          </div>
          <div className="sub-card-price-row">
            <span className="sub-card-price">$35</span>
            <span className="sub-card-unit">/mo</span>
          </div>
          <button
            className="sub-card-btn"
            onClick={() => setModal({ open: true, plan: "monthly" })}
          >
            Subscribe
          </button>
        </div>

        {/* Yearly Card */}
        <div className="sub-card yearly">
          <div className="sub-card-header">
            <span className="sub-card-title">Yearly</span>
            <span className="sub-card-billing">billed yearly($159)</span>
            <span className="most-popular-badge">
              <span role="img" aria-label="party">
                🎉
              </span>{" "}
              Most popular
            </span>
          </div>
          <div className="sub-card-desc">
            <strong>Our most popular plan</strong> previously sold for $299 and
            is now only <strong>$13.25/month</strong>.<br />
            This plan <strong>saves you over 60%</strong> in comparison to the
            monthly plan.
          </div>
          <div className="sub-card-price-row">
            <span className="sub-card-price">$13.25</span>
            <span className="sub-card-unit">/mo</span>
          </div>
          <button
            className="sub-card-btn"
            onClick={() => setModal({ open: true, plan: "yearly" })}
          >
            Subscribe
          </button>
        </div>
      </div>
      <PopupModal
        open={modal.open}
        plan={modal.plan}
        onClose={() => setModal({ open: false, plan: "" })}
      />
    </>
  );
}

export default PremiumSubCard;
