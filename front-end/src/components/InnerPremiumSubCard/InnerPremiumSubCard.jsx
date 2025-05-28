import React from "react";
import "./InnerPremiumSubCard";
import { Link } from "react-router-dom";

function InnerPremiumSubCard() {
  return (
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
            <strong>all premium features</strong>, the best plan for short-term
            subscribers.
          </span>
        </div>
        <div className="sub-card-price-row">
          <span className="sub-card-price">$35</span>
          <span className="sub-card-unit">/mo</span>
        </div>
        <Link to="/monthlysubscription" className="text-decor w-full">
          <button className="sub-card-btn">Subscribe</button>
        </Link>
      </div>

      {/* Yearly Card */}
      <div className="sub-card yearly">
        <div className="sub-card-header">
          <span className="sub-card-title">Yearly</span>
          <span className="sub-card-billing">billed yearly ($159)</span>
          <span className="most-popular-badge">
            <span role="img" aria-label="party">
              🎉
            </span>{" "}
            Most popular
          </span>
        </div>
        <div className="sub-card-desc">
          <strong>Our most popular plan</strong> previously sold for $299 and is
          now only <strong>$13.25/month</strong>.<br />
          This plan <strong>saves you over 60%</strong> in comparison to the
          monthly plan.
        </div>
        <div className="sub-card-price-row">
          <span className="sub-card-price">$13.25</span>
          <span className="sub-card-unit">/mo</span>
        </div>
        <Link to="/yearlysubscription" className="text-decor w-full">
          <button className="sub-card-btn">Subscribe</button>
        </Link>
      </div>
    </div>
  );
}

export default InnerPremiumSubCard;
