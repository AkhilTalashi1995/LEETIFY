import React from "react";
import "./AllUsers.scss";

const userData = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    username: "johndoe",
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@example.com",
    username: "janedoe",
  },
  {
    firstName: "Bob",
    lastName: "Smith",
    email: "bobsmith@example.com",
    username: "bobsmith",
  },
];

const AllUsers = () => {
  return (
    <table className="user-tablexx">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        {userData.map((user, index) => (
          <tr key={index}>
            <td data-label="First Name">{user.firstName}</td>
            <td data-label="Last Name">{user.lastName}</td>
            <td data-label="Email">{user.email}</td>
            <td data-label="Username">{user.username}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllUsers;
