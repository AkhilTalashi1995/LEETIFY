import logo from "./logo.svg";
import "./App.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import UserHome from "./pages/UserHome/UserHome";
import authenticate from "./utils/utils";
import ProblemPage from "./pages/ProblemPage/ProblemPage";
import Premium from "./pages/PremiumPage/PremiumPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import InnerPremiumPage from "./pages/InnerPremiumPage/InnerPremiumPage";
import UserProfile from "./pages/UserProfile/UserProfile";
import ThankYou from "./pages/ThankYou/ThankYou";
import CancelTransaction from "./pages/CancelTransaction/CancelTransaction";
import UserDashboardPage from "./pages/UserDashboardPage/UserDashboardPage";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import PublicRoute from "./components/PublicRoute/PublicRoute";

// Stripe Elements integration
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Google Analytics hook
import useGoogleAnalytics from "./useGoogleAnalytics";

// Stripe public key (use only publishable key here, never secret!)
const stripePromise = loadStripe(
  "pk_test_51RWNYy03QVaE1lftjfjiGDARWs9z8G0PWnnZzDu5NFre2hzcZTfbdkjeWGcJfC5jfK4Qbjh2Ua4AS50zbspDAQOY00xa8q8mcD"
);

// Route guard for authenticated pages
function ProtectedRoute(props) {
  const state = useSelector((state) => state.userData);
  const isAuthenticated = state ? authenticate(state.token) : false;
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return props.element;
}

function App() {
  const state = useSelector((state) => state);

  useGoogleAnalytics();

  return (
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

export default App;
