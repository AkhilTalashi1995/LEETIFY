import logo from "./logo.svg";
import "./App.css";

import { useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import UserHome from "./pages/UserHome/UserHome";
import { useSelector } from "react-redux";
import authenticate from "./utils/utils";
import ProblemPage from "./pages/ProblemPage/ProblemPage";
import Premium from "./pages/PremiumPage/PremiumPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import InnerPremiumPage from "./pages/InnerPremiumPage/InnerPremiumPage";
import UserProfile from "./pages/UserProfile/UserProfile";
import MonthlySubscription from "./pages/MonthlySubscription/MonthlySubscription";
import YearlySubscription from "./pages/YearlySubscription/YearlySubscription";
import ThankYou from "./pages/ThankYou/ThankYou";
import CancelTransaction from "./pages/CancelTransaction/CancelTransaction";
import UserDashboardPage from "./pages/UserDashboardPage/UserDashboardPage";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import PublicRoute from "./components/PublicRoute/PublicRoute"; // adjust path as needed

// Stripe Elements integration
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/**
 * Stripe public key (use only publishable key here, never secret!)
 * @type {Promise<Stripe | null>}
 */
const stripePromise = loadStripe(
  "pk_test_51RWNYy03QVaE1lftjfjiGDARWs9z8G0PWnnZzDu5NFre2hzcZTfbdkjeWGcJfC5jfK4Qbjh2Ua4AS50zbspDAQOY00xa8q8mcD"
);

/**
 * Main App component. Handles:
 * - Stripe Elements context
 * - React Router setup (public/protected routes)
 * - Auth protection via ProtectedRoute and PublicRoute
 */
function App() {
  const state = useSelector((state) => state);

  return (
    // Stripe Elements wrapper required for any payment integration
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<PublicRoute element={<Home />} />} />
          <Route
            path="/signin"
            element={<PublicRoute element={<Signin />} />}
          />
          <Route
            path="/signup"
            element={<PublicRoute element={<Signup />} />}
          />
          <Route
            path="/premiumpage"
            element={<PublicRoute element={<Premium />} />}
          />

          {/* Protected pages - must be logged in to access */}
          <Route
            path="/home"
            element={<ProtectedRoute element={<UserHome />} />}
          />
          <Route
            path="/userprofile"
            element={<ProtectedRoute element={<UserProfile />} />}
          />
          <Route
            path="/innerpremiumpage"
            element={<ProtectedRoute element={<InnerPremiumPage />} />}
          />
          <Route
            path="/userDashboard"
            element={<ProtectedRoute element={<UserDashboardPage />} />}
          />
          <Route
            path="/problems/:problemName"
            element={<ProtectedRoute element={<ProblemPage />} />}
          />
          <Route
            path="/monthlysubscription"
            element={<ProtectedRoute element={<MonthlySubscription />} />}
          />
          <Route
            path="/yearlysubscription"
            element={<ProtectedRoute element={<YearlySubscription />} />}
          />
          <Route
            path="/thankyou"
            element={<ProtectedRoute element={<ThankYou />} />}
          />
          <Route
            path="/canceltransaction"
            element={<ProtectedRoute element={<CancelTransaction />} />}
          />
          <Route
            path="/comingsoon"
            element={<ProtectedRoute element={<ComingSoon />} />}
          />
        </Routes>
      </BrowserRouter>
    </Elements>
  );
}

/**
 * Route guard for authenticated pages.
 * Redirects to home if not logged in.
 *
 * @param {object} props
 * @param {JSX.Element} props.element - The element to render if authenticated
 * @returns {JSX.Element}
 */
function ProtectedRoute(props) {
  // Extract user data from Redux state
  const state = useSelector((state) => state.userData);

  // Check if user has a valid token
  const isAuthenticated = state ? authenticate(state.token) : false;

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the requested page
  return props.element;
}

export default App;
