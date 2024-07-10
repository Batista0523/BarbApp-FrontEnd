import React, { useState, useEffect } from "react";
import { fetchOneItem } from "../../helpers/apiCalls";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const endpoint = "users";

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        if (id) {
          const userDetails = await fetchOneItem(endpoint, id);
          setUser(userDetails.success.payload);
        }
      } catch (error) {
        console.error("Error fetching specific user", error);
        setUser(null); 
      }
    };

    getUserDetails();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>; // Handle loading state if needed
  }

  return (
    <div>
      <h1>Welcome to your profile, {user.name}</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;
