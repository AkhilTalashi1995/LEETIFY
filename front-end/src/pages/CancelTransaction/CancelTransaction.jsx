import React from "react";
import "./Cancel-Transaction.scss";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import CommonFooter from "../../components/CommonFooter/Cfooter";

function CancelTransaction() {
  return (
    <>
      <Navbar />
      <div className="cancel-container">
        <div className="cancel-main flex">
          <div className="cancel-content flex">
            <h1>You're almost there!</h1>
            <p>
              Sorry, we had an issue confirming your payment. Please try again.
            </p>
            <Link to="/innerpremiumpage">
              <button className="cancel-content-button">Go Back</button>
            </Link>
          </div>
          <div className="cancel-image flex">
            <img src="sorry.png" alt="" width="300" height="400" />
          </div>
        </div>
      </div>
    </>
  );
}

export default CancelTransaction;
