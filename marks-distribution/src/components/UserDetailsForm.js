import React, { useState } from "react";
import "./UserDetailsForm.css"; // Create a CSS file for styling

const UserDetailsForm = ({ onSubmit }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    nuid: "",
    group: "1", // Default group number
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, nuid, group } = userDetails;

    if (!name || !email || !nuid || !group) {
      setError("All fields are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/user-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "User details submitted successfully!");
        onSubmit(userDetails); // Pass user details to the parent component
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit user details.");
      }
    } catch (err) {
      console.error("Error submitting user details:", err);
      setError("Failed to submit user details.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">User Details</h2>
      <form onSubmit={handleSubmit} className="user-details-form">
        <div className="form-group" >
          <label className="form-label">
            Your Name:
            <input
            style={{width:"380px", marginLeft:"10px"}}
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="form-input"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">
            Your Email:
            <input
            style={{width:"380px", marginLeft:"15px"}}
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">
            Your NUID:
            <input
            style={{width:"380px", marginLeft:"15px"}}
              type="text"
              name="nuid"
              value={userDetails.nuid}
              onChange={handleChange}
              placeholder="Enter your NUID"
              className="form-input"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">
            Your Group Number:
            <select
            style={{width:"200px", marginLeft:"10px"}}
              name="group"
              value={userDetails.group}
              onChange={handleChange}
              className="form-input"
              required
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Group {i + 1}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          Next
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;