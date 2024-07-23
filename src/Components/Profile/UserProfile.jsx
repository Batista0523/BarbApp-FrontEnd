import React, { useState, useEffect } from "react";
import { fetchOneItem, addItem } from "../../helpers/apiCalls";
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
      {user.role === "customer" ? (
        <div className="customer-container">
          <h1>customer profile</h1>
          <p>Name {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>phone: {user.phone_number}</p>
        </div>
      ) : user.role === "barber" ? (
        <div className="barber contains">
          <h1>Barber profile</h1>
          <p>Name:{user.name}</p>
          <p>Phone number {user.phone_number}</p>
          <p>Email:{user.email}</p>
        </div>
      ) : null}
      <button onClick={handleLogOff} className="btn btn-danger">
        Log Off
      </button>
    </div>
  );
};

export default UserProfile;
