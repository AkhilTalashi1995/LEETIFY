import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Inner-Premium-Sub-Card.scss"; // Make sure this path is correct

const YEARLY_PRICE_ID = "price_1RWnzo03QVaE1lftYrV9ZMHZ";
const MONTHLY_PRICE_ID = "price_1RWnzX03QVaE1lftUobIfe3M";

function InnerPremiumSubCard() {
  const user = useSelector((state) => state.userData?.user);
  const [modal, setModal] = useState({ open: false, plan: "" });

  const isPremiumActive =
    user?.user_status === "PREMIUM_USER" &&
    user?.subscription_end &&
    new Date(user.subscription_end) > new Date();

  const formattedEnd = user?.subscription_end
    ? new Date(user.subscription_end).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Handler for Stripe Checkout
  const handleCheckout = async (priceId, plan) => {
    if (isPremiumActive) {
      setModal({ open: true, plan });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-checkout-session`,
        {
          priceId,
          email: user?.email,
        }
      );
      window.location.href = response.data.url;
    } catch (err) {
      alert(
        "Failed to start checkout: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  // Modal component
  function PopupModal({ open, plan, onClose }) {
    if (!open) return null;
    return (
      <div className="premium-modal-backdrop" onClick={onClose}>
        <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
          <h3>Already Subscribed</h3>
          <p>
            You already have an active{" "}
            {plan === "monthly" ? "Monthly" : "Yearly"} subscription until{" "}
            <b>{formattedEnd}</b>.<br />
            You can resubscribe after it expires.
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
            onClick={() => handleCheckout(MONTHLY_PRICE_ID, "monthly")}
          >
            {isPremiumActive ? "Already Subscribed" : "Subscribe"}
          </button>
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
            onClick={() => handleCheckout(YEARLY_PRICE_ID, "yearly")}
          >
            {isPremiumActive ? "Already Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>

      {/* Popup */}
      <PopupModal
        open={modal.open}
        plan={modal.plan}
        onClose={() => setModal({ open: false, plan: "" })}
      />
    </>
  );
}

export default InnerPremiumSubCard;
