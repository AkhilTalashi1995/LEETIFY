import React from "react";
import "./CustomerReviews.scss";

function CustomerReviews() {
  return (
    <div className="reviews-container">
      <div className="question">
        <p>
          What others
          are saying <br />
          about us?
        </p>
      </div>

      <div className="reviews">
        <div className="review">
          <div className="comp-logo">
            <img src="facebookcircle.png" alt="Facebook Logo" />
          </div>
          <p>
            “I gained all my coding skills from Leetify, the reward — two
            on-site interviews with Facebook and LinkedIn, respectively. I am
            lucky to get Facebook's job offer!”
          </p>
          <h5>Yuanwei</h5>
        </div>

        <div className="review">
          <div className="comp-logo">
            <img src="facebookcircle.png" alt="Facebook Logo" />
            <img src="blabkB.jpeg" alt="Bloomberg Logo" />
          </div>
          <p>
            “After buckling down and studying the questions on Leetify, the
            result is two internship offers from Facebook and Bloomberg.”
          </p>
          <h5>Andy</h5>
        </div>

        <div className="review">
          <div className="comp-logo">
            <img src="Amazoncircle.png" alt="Amazon Logo" />
          </div>
          <p>
            “Had my on-site interviews at Amazon and today the recruiter told me
            that I will get a job offer. Thank you to the whole Leetify team!”
          </p>
          <h5>Georg Hennerbichler</h5>
        </div>
      </div>
    </div>
  );
}

export default CustomerReviews;
