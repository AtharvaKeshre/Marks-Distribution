import React, { useState } from "react";
import UserDetailsForm from "./components/UserDetailsForm";
import GroupRatingForm from "./components/GroupratingForm";

function App() {
  const [userDetails, setUserDetails] = useState(null);

  const handleUserDetailsSubmit = (details) => {
    setUserDetails(details); // Save user details and navigate to the next page
  };

  return (
    <div>
      <h1 style={{
        textAlign: "center",
        fontSize: "2rem",
        margin: "20px 0",
        color: "#333",
      }}>Group Rating DAMG6210</h1>
      {!userDetails ? (
        <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
      ) : (
        <GroupRatingForm userDetails={userDetails} />
      )}
    </div>
  );
}

export default App;