import React, { useState } from "react";
import "./GroupratingForm.css"; // Import the CSS file

const GroupRatingForm = ({ userDetails }) => {
  const [members, setMembers] = useState([
    { name: "", points: 0 }, // Start with only one member
  ]);

  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track form submission

  const handlePointsChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index].points = value === "" ? "" : parseInt(value) || 0; // Handle empty input
    setMembers(updatedMembers);

    const totalPoints = updatedMembers.reduce((sum, member) => sum + (parseInt(member.points) || 0), 0);
    if (totalPoints > 100) {
      setError("Total points cannot exceed 100.");
    } else if (totalPoints < 100) {
      setError("Total points must equal 100.");
    } else {
      setError("");
    }
  };

  const handleNameChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index].name = value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, { name: "", points: 0 }]);
  };

  const handleDeleteMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPoints = members.reduce((sum, member) => sum + (parseInt(member.points) || 0), 0);
    if (totalPoints !== 100) {
      alert("Please ensure the total points equal 100.");
      return;
    }

    // Filter out members with null or empty names
    const validMembers = members.filter((member) => member.name.trim() !== "");

    if (validMembers.length === 0) {
      alert("Please provide valid names for at least one member.");
      return;
    }

    try {
      const response = await fetch("https://marks-distribution.onrender.com/api/group-ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: userDetails.group, // Pass the group ID from user details
          ratings: validMembers,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true); // Set the submission state to true
      } else {
        const data = await response.json();
        alert(data.error || "Failed to submit group ratings.");
      }
    } catch (err) {
      console.error("Error submitting group ratings:", err);
      alert("Failed to submit group ratings.");
    }
  };

  if (isSubmitted) {
    // Render the thank-you message if the form is submitted
    return (
      <div className="thank-you-container">
        <h2>Thank You!</h2>
        <p>Your group ratings have been submitted successfully.</p>
        <p>You may now close this window.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <p className="form-title" style={{ color: "red" }}>
        "<strong>Note: </strong>Please ensure the total points equal 100."
      </p>
      <h2 className="form-title">Rate Your Group Members</h2>
      <form onSubmit={handleSubmit} className="rating-form">
        {members.map((member, index) => (
          <div key={index} className="form-group">
            <label className="form-label">
              Name:
              <input
              required
              style={{width:"300px", marginLeft:"10px"}}
                type="text"
                value={member.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Enter name"
                className="form-input name-input"
              />
            </label>
            <label className="form-label">
              Points:
              <input style={{marginLeft:"10px", width:"100px"}}
                type="number"
                value={member.points === 0 ? "" : member.points} // Show empty input if points are 0
                placeholder="0"
                onChange={(e) => handlePointsChange(index, e.target.value)}
                min="0"
                max="100"
                className="form-input points-input"
              />
            </label>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button style={{height:"40px", width:"120px"}} type="button" className="add-button" onClick={handleAddMember}>
          Add Member
        </button>
            <button style={{height:"40px", width:"120px", marginTop:"10px"}}
              type="button"
              className="delete-button"
              onClick={() => handleDeleteMember(index)}
              disabled={members.length === 1} // Disable delete if only one member exists
            >
              Delete
            </button>
            </div>
          </div>
        ))}
        
        <button type="submit" className="submit-button" disabled={error !== ""}>
          Submit
        </button>
        
        <div className="total-points">
          <strong>Total Points:</strong> {members.reduce((sum, member) => sum + (parseInt(member.points) || 0), 0)} / 100
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default GroupRatingForm;