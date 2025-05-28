import React from "react";
import "./Premium-Page.scss";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import LandingPageNavbar from "../../components/LandingPageNavbar/LandingPageNavbar";
import PremiumContent from "../../components/PremiumContent/PremiumContent";
import CustomerReviews from "../../components/CustomerReviews/CustomerReviews";
import PremiumSubCard from "../../components/PremiumSubCard/PremiumSubCard";

function Premium() {
  return (
    <>
      <LandingPageNavbar />
      <PremiumContent />
      <PremiumSubCard />
      <CustomerReviews />
    </>
  );
}

export default Premium;
