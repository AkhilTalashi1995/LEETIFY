import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllUsers.scss";

const getUserType = (user_status) => {
  if (user_status === "PREMIUM_USER") return "Premium";
  if (user_status === "USER") return "Normal";
  return user_status;
};

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="user-modal-backdrop" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Are you sure?</h3>
        <p>
          Do you really want to delete this user? <br /> This action cannot be
          undone.
        </p>
        <div className="user-modal-btn-row">
          <button className="user-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="user-modal-btn delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, userId: null });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    axios
      .get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDeleteUser = (id) => {
    setModal({ open: true, userId: id });
  };

  const confirmDelete = () => {
    const token = localStorage.getItem("jwtToken");
    const userId = modal.userId;
    setModal({ open: false, userId: null });
    axios
      .delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      })
      .catch(() => {
        alert("Failed to delete user.");
      });
  };

  if (loading)
    return <div className="user-tablexx-loading">Loading users...</div>;

  return (
    <div className="user-tablexx-outer-scroll">
      <table className="user-tablexx" aria-label="All Users Table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td data-label="First Name">{user.firstname}</td>
              <td data-label="Last Name">{user.lastname}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="User Type">{getUserType(user.user_status)}</td>
              <td data-label="Action">
                {user.user_status !== "ADMIN" ? (
                  <button
                    className="delete-user-btn"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <span style={{ color: "#bbb", fontWeight: 500 }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDeleteModal
        open={modal.open}
        onClose={() => setModal({ open: false, userId: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AllUsers;
