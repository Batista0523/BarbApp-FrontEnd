import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneItem } from "../../helpers/apiCalls";

function BarberDetails() {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [barberReview, setBarberReview] = useState(null);

  // fecth details for one barber
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


  useEffect(() => {
    const reviewEndpoint = "reviews";
    const fecthBarberReviews = async () => {
      try {
        if (id) {
          const barberReview = await fetchOneItem(reviewEndpoint, id);
          console.log("here is barbeReview", barberReview)
          if (barberReview ) {
            setBarberReview(barberReview.payload);
          } else {
            console.error("invalid response format", barberReview);
            setBarberReview(null);
          }
        }
      } catch (error) {
        console.error("Error fetching barber review", error);
        setBarberReview(null);
      }
    };
    fecthBarberReviews();
  }, [id]);



  return (
    // need to add inputs to add reviews and appointment to eh specific barber
    <div>
    {!barber ? (
      <div>Loading barber details...</div>
    ) : (
      <>
        <h1>{barber.name}'s Details</h1>
        <p>{barber.profile_info}</p>
        <p>{barber.phone_number}</p>
        <p>{barber.address}</p>
        <h4>Reviews</h4>
        {!barberReview ? (
          <div>Loading reviews...</div>
        ) : (
          <>
            <p>Rating: {barberReview.rating}</p>
            <p>Review: {barberReview.review_text}</p>
          </>
        )}
      </>
    )}
  </div>
);
}

export default BarberDetails;
