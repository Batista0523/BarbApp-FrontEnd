import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneItem } from "../../helpers/apiCalls";

function BarberDetails() {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [barberReview, setBarberReview] = useState(null);
  const [barberServices, setbarberServices] = useState(null);
  const [barberAppointments, setBarberAppointments] = useState(null);
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
            console.log(fetchedBarberReview, "reviews");
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
  //fetch services for barber
  useEffect(() => {
    const servicesEndpoint = "services";
    const fetchServices = async () => {
      try {
        if (id) {
          const fetchedBarberServices = await fetchOneItem(
            servicesEndpoint,
            id
          );
          if (fetchedBarberServices.success) {
            console.log(fetchedBarberServices, "services");
            setbarberServices(fetchedBarberServices.payload);
          } else {
            console.error("Invalid response format", fetchedBarberServices);
            setbarberServices(null);
          }
        }
      } catch (error) {
        console.error("Error fetching services", error);
        setbarberServices(null);
      }
    };
    fetchServices();
  }, [id]);

  //fetch appointments
  //need to fetch specific service according tot he appointments
  useEffect(() => {
    const appointmentsEndpoint = "appointments";
    const fetchAppointments = async () => {
      try {
        if (id) {
          const fetchedBarberAppointments = await fetchOneItem(
            appointmentsEndpoint,
            id
          );
          if (fetchedBarberAppointments.success) {
            console.log(fetchedBarberAppointments, "appointments");
            setBarberAppointments(fetchedBarberAppointments.payload);
          } else {
            console.error("Invalid response format", fetchedBarberAppointments);
            setBarberAppointments(null);
          }
        }
      } catch (error) {
        console.error("Error fetching services", error);
        setBarberAppointments(null);
      }
    };
    fetchAppointments();
  }, [id]);
  return (
    <div className="barber-details-container">
      {!barber ? (
        <div>Loading barber details...</div>
      ) : (
        <div className="all-conatiner">
          <div className="details-container">
            <h1>{barber.name}'s Details</h1>
            <p>{barber.profile_info}</p>
            <p>{barber.phone_number}</p>
            <p>{barber.address}</p>
          </div>
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
          <div className="services-container">
            <h4>Services</h4>
            {!barberServices ? (
              <div>Loading services...</div>
            ) : (
              <div>
                <p>{`${barberServices.service_name}  = price: ${barberServices.price}`}</p>
              </div>
            )}
          </div>
          <div className="appointments-container">
            <h4>Appointments</h4>
            {!barberAppointments ? (
              <div>Loading appointments...</div>
            ) : (
              <div>
                <p>Date: {barberAppointments.appointment_date}</p>
                <p>Time: {barberAppointments.appointment_time}</p>
                <p>status: {barberAppointments.status}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BarberDetails;
