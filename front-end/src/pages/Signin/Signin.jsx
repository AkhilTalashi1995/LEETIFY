import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "../Signup/auth.scss";

const SignIn = () => {
  const appState = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setErr("");
    axios
      .post("leetify-backend.vercel.app/signin", formData)
      .then((response) => {
        dispatch({
          type: "SIGNIN_SUCCESS",
          payload: response.data,
        });
        localStorage.setItem("jwtToken", response.data.token);
        setLoading(false);
        navigate("/home");
      })
      .catch((error) => {
        setErr("Invalid credentials. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in-auth">
        <Link to="/Home" className="auth-logo">
          <img src="logo-main.png" alt="leetify-logo" />
          <span>Leetify</span>
        </Link>
        <h2>Sign in to your account</h2>
        <form onSubmit={handleSubmit}>
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
          {err && <div className="auth-error">{err}</div>}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
        </form>
        <div className="auth-alt">
          <span>Don’t have an account?</span>
          <Link to="/signup">Sign up</Link>
        </div>
        {/* Demo credentials for recruiters */}
        <div className="auth-demo">
          <div>
            <strong>Demo Admin login:</strong>
            <div>
              <span>Email:</span>{" "}
              <span className="auth-demo-email">admin@gmail.com</span>
            </div>
            <div>
              <span>Password:</span>{" "}
              <span className="auth-demo-pass">pass</span>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <strong>Demo user login:</strong>
            <div>
              <span>Email:</span>{" "}
              <span className="auth-demo-email">test@gmail.com</span>
            </div>
            <div>
              <span>Password:</span>{" "}
              <span className="auth-demo-pass">test</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
