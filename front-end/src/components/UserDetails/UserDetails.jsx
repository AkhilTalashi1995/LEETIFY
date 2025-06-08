import React, { useState } from "react";
import "./UserDetails.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import axios from "axios";

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function UserDetails() {
  const userData = useSelector((state) => state.userData);
  const navigate = useNavigate();

  // Set initial state to user values, or empty
  const [firstName, setFirstName] = useState(userData?.user?.firstname || "");
  const [lastName, setLastName] = useState(userData?.user?.lastname || "");
  const [email, setEmail] = useState(userData?.user?.email || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Subscription end date logic
  const isPremium = userData?.user?.user_status === "PREMIUM_USER";
  const subscriptionEnd = userData?.user?.subscription_end;

  const handleSave = () => {
    setSaving(true);
    const data = {
      _id: userData.user._id,
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };
    axios
      .put(`${process.env.REACT_APP_API_URL}/users/${userData.user._id}`, data)
      .then((res) => {
        window.alert("Profile updated successfully!");
        navigate("/", { replace: true });
      })
      .catch((err) => {
        window.alert("There was an error updating your profile.");
        console.log(err);
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="userdetails-bg">
      <div className="userdetails-hero">
        <h1>Welcome</h1>
        <p>
          Manage your info, privacy, and security to make Leetify work better
          for you.
        </p>
        <br />
        <br />
        <br />
      </div>
      <div className="userdetails-card">
        <Avatar
          alt={firstName}
          sx={{
            width: 72,
            height: 72,
            bgcolor: "#203a43",
            fontSize: 32,
            margin: "0 auto 14px auto",
          }}
        >
          {firstName ? firstName[0] : ""}
        </Avatar>
        <h2>Edit Profile</h2>
        <p className="userdetails-form-desc">
          Use the form below to edit your personal info.
        </p>

        {/* --- Show subscription details if premium --- */}
        {isPremium && subscriptionEnd && (
          <div className="subscription-info-badge">
            <span role="img" aria-label="crown" className="sub-crown">
              👑
            </span>
            <span>
              <strong>Premium</strong> — active until{" "}
              <span className="subscription-end-date">
                {formatDate(subscriptionEnd)}
              </span>
            </span>
          </div>
        )}

        <form
          className="userdetails-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <TextField
            label="First Name"
            name="firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label="Last Name"
            name="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <Button
            variant="contained"
            className="userdetails-btn"
            type="submit"
            fullWidth
            disabled={saving}
            sx={{
              marginTop: "1.6rem",
              padding: "0.9rem",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "1.08rem",
              background: "#42bd9f",
              textTransform: "none",
              "&:hover": {
                background: "#2d9d81",
              },
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UserDetails;
