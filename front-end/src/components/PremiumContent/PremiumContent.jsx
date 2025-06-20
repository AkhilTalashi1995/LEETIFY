import React from "react";
import "./premiumcontent.scss";
function PremiumContent() {
  return (
    <>
      <section className="prem-first-fold">
        <img src="prem-logo.svg" alt="" />
        <div className="prem-box-2 fade-in">
          <h1>Premium</h1>
        </div>
        <div className="Prem-tag fade-in">
          <p>
            {" "}
            Get started with a Leetify <br /> Subscription that works for you.
          </p>
        </div>
      </section>
      <section>
        <div className="subscription fade-in-2">
          <h2>Monthly and Yearly Pricing Plans</h2>
          <p>
            Our monthly and yearly plans, grants access to{" "}
            <span>
              {" "}
              all premium{" "}
              <span className="d-none d-md-inline">
                <br />
              </span>
              features
            </span>
            , the best plans for all subscribers.
          </p>
        </div>
      </section>
    </>
  );
}

export default PremiumContent;
