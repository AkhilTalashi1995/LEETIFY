import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import "./Thank-you.scss";

function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get session_id from Stripe Checkout redirect URL
  const getSessionId = () => {
    const params = new URLSearchParams(location.search);
    return params.get("session_id");
  };

  // Helper: Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId && localStorage.jwtToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.jwtToken}`,
          },
        })
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
          // Update Redux so the rest of the app sees the new premium status
          dispatch({
            type: "SIGNIN_SUCCESS",
            payload: {
              ...userData,
              user: res.data.user,
            },
          });
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // Only depend on location.search to avoid infinite loop!
  }, [location.search, dispatch]);

  return (
    <>
      <Navbar />
      <div className="thank-you-container">
        <div className="thank-you-main flex">
          <div className="thank-you-content flex">
            <h1>Congratulations! 🎉</h1>
            <p style={{ marginBottom: "1.2em", fontSize: "1.16rem" }}>
              You’re officially a <b>Leetify Premium Member</b>!
            </p>
            <p style={{ marginBottom: "1.8em" }}>
              Thank you for upgrading. You now have access to all premium
              problems and features.
              <br />
              Get ready to boost your skills and ace your next interview!
            </p>
            {loading && <p>Loading your premium details...</p>}
            {!loading &&
              user &&
              user.user_status === "PREMIUM_USER" &&
              user.subscription_end && (
                <div style={{ marginBottom: "1.7em" }}>
                  <b>Your Premium access is valid until:</b>
                  <br />
                  <span
                    style={{
                      color: "#11998e",
                      fontWeight: "bold",
                      fontSize: "1.13rem",
                    }}
                  >
                    {formatDate(user.subscription_end)}
                  </span>
                </div>
              )}
            {!loading && user && user.user_status !== "PREMIUM_USER" && (
              <div style={{ marginBottom: "1.7em", color: "#bb1212" }}>
                There was an issue upgrading your account. Please contact
                support.
              </div>
            )}
            {!loading && !user && (
              <p>Could not load your account details. Please log in again.</p>
            )}
            <button
              className="thank-you-content-button"
              onClick={() => navigate("/home")}
            >
              Explore Premium Problems
            </button>
          </div>
          <div className="thank-you-image flex">
            <img src="/thankyou.png" alt="Thank you" width="300" height="400" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ThankYou;
