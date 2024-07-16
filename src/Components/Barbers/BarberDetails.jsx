import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneItem } from "../../helpers/apiCalls";

function BarberDetails() {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [barberReview, setBarberReview] = useState(null);

  // Fetch details for one barber
  useEffect(() => {
    const userEndpoint = `users`;
    const fetchBarberDetails = async () => {
      try {
        if (id) {
          const userDetails = await fetchOneItem(userEndpoint, id);
          if (userDetails.success) {
            setBarber(userDetails.payload);
          } else {
            console.error("Invalid response format:", userDetails);
            setBarber(null);
          }
        }
      } catch (error) {
        console.error("Error fetching barber details:", error);
        setBarber(null);
      }
    };
    fetchBarberDetails();
  }, [id]);

  // Fetch reviews for the barber
  useEffect(() => {
    const reviewEndpoint = "reviews";
    const fetchBarberReviews = async () => {
      try {
        if (id) {
          const fetchedBarberReview = await fetchOneItem(reviewEndpoint, id);
          if (fetchedBarberReview) {
            setBarberReview(fetchedBarberReview);
          } else {
            console.error("Invalid response format", fetchedBarberReview);
            setBarberReview(null);
          }
        }
      } catch (error) {
        console.error("Error fetching barber review", error);
        setBarberReview(null);
      }
    };
    fetchBarberReviews();
  }, [id]);

  // Helper function to display star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push("⭐");
    }
    return stars.join("");
  };

  return (
    <div className="barber-details-container">
      {!barber ? (
        <div>Loading barber details...</div>
      ) : (
        <div>
          <h1>{barber.name}'s Details</h1>
          <p>{barber.profile_info}</p>
          <p>{barber.phone_number}</p>
          <p>{barber.address}</p>
          <div className="review-container">
            <h4>Reviews</h4>
            {!barberReview ? (
              <div>Loading reviews...</div>
            ) : (
              <div>
                <p>Rating: {renderStars(barberReview.rating)}</p>
                <p>Comments: {barberReview.review_text}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BarberDetails;
