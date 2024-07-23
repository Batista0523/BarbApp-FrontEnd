import React, { useState, useEffect } from "react";
import { fetchOneItem, addItem, fetchAllItems } from "../../helpers/apiCalls";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = ({ onLogOff }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const endpoint = "users";
    const reviewEndpoint = "reviews";
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
          const fetchedReviews = await fetchAllItems(reviewEndpoint, id);
          if (fetchedReviews.success) {
            let fetcheReviewById = fetchedReviews.payload;
            fetcheReviewById = fetcheReviewById.filter((reviewById) => {
              return reviewById.barber_id === Number(id);
            });
            setReviews(fetcheReviewById);
          } else {
            console.error("Ivalid format", fetchedReviews);
            setReviews([]);
          }
        }
      } catch (error) {
        console.error("Error fetching specific user", error);
        setUser(null);
        setReviews([]);
      }
    };

    getUserDetails();
  }, [id]);

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

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
          <div className="review-container">
            <h4> Your reviews</h4>
            {!reviews ? (
              <div>loading review...</div>
            ) : (
              reviews.map((reviews, index) => (
                <div key={index}>
                  <p>review {renderStars(reviews.rating)}</p>
                  <p>review --- {reviews.review_text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
      <button onClick={handleLogOff} className="btn btn-danger">
        Log Off
      </button>
    </div>
  );
};

export default UserProfile;
