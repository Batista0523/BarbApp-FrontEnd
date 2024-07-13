import React, { useState, useEffect } from "react";
import { fetchOneItem } from "../../helpers/apiCalls";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = ({ onLogOff }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const endpoint = "users";
  const navigate = useNavigate();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        if (id) {
          const userDetails = await fetchOneItem(endpoint, id);
          console.log("User details:", userDetails);
          if (userDetails.success) {
            setUser(userDetails.payload);
          } else {
            console.error("Invalid response format:", userDetails);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error fetching specific user", error);
        setUser(null);
      }
    };

    getUserDetails();
  }, [id]);

  const handleLogOff = () => {
    setUser(null);
    onLogOff(); // Call log-off function from props to update NavBar
    navigate("/"); // Send user home
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to your profile, {user.name}</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={handleLogOff} className="btn btn-danger">
        Log Off
      </button>
    </div>
  );
};

export default UserProfile;
