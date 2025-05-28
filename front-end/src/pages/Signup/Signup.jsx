import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.scss";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    user_status: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await axios.post(
        "https://leetify-backend.vercel.app/signup",
        formData
      );
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/signin"), 1600);
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User already exists! Redirecting to login page!");
        setTimeout(() => {
          navigate("/signin");
        }, 1800);
      } else {
        setError("Signup failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in-auth">
        <Link to="/Home" className="auth-logo">
          <img src="logo-main.png" alt="leetify-logo" />
          <span>Leetify</span>
        </Link>
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-names">
            <TextField
              label="First name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              type="text"
              required
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Last name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              type="text"
              required
              variant="outlined"
              margin="normal"
              fullWidth
            />
          </div>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            fullWidth
            required
            margin="normal"
            variant="outlined"
          />
          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div className="auth-success">Sign up successful! Redirecting…</div>
          )}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            className="auth-btn"
            disabled={loading || success}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </form>
        <div className="auth-alt">
          <span>Already have an account?</span>
          <Link to="/signin">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
