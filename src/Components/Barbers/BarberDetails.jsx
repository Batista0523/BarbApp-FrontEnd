import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneItem, addItem, fetchAllItems } from "../../helpers/apiCalls";

function BarberDetails() {
  const { id } = useParams();
  const [barber, setBarber] = useState([]);
  const [barberReview, setBarberReview] = useState([]);
  const [barberServices, setBarberServices] = useState([]);
  const [barberAppointments, setBarberAppointments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [initialize, setInitialize] = useState({ rating: "", review_text: "" });
  const [formData, setFormData] = useState(initialize);
  useEffect(() => {
    const userEndpoint = "users";
    const reviewEndpoint = "reviews";
    const servicesEndpoint = "services";
    const appointmentsEndpoint = "appointments";

    const fetchAllData = async () => {
      try {
        if (id) {
          //fetch barber details
          const userDetails = await fetchOneItem(userEndpoint, id);
          if (userDetails.success) {
            setBarber(userDetails.payload);
          } else {
            console.error("Invalid response format:", userDetails);
            setBarber([]);
          }
         
          const [
            fetchedBarberServices,
            fetchedBarberAppointments,
            fetchedBarberReviews,
          ] = await Promise.all([
            fetchAllItems(servicesEndpoint, id),
            fetchAllItems(appointmentsEndpoint, id),
            fetchAllItems(reviewEndpoint, id),
          ]);
          if (
            fetchedBarberServices.success &&
            fetchedBarberAppointments.success &&
            fetchedBarberReviews
          ) {
            let Services = fetchedBarberServices.payload;
            let Appointments = fetchedBarberAppointments.payload;
            let Reviews = fetchedBarberReviews.payload;
            Services = Services.filter((service) => {
              return service.barber_id === Number(id);
            });
            Appointments = Appointments.filter((appointments) => {
              return appointments.barber_id === Number(id);
            });
            Reviews = Reviews.filter((review) => {
              return review.barber_id === Number(id);
            });
            setBarberReview(Reviews);
            setBarberServices(Services);
            setBarberAppointments(Appointments);
          } else {
            console.error(
              "Invalid response format",
              fetchedBarberServices,
              fetchedBarberAppointments,
              fetchedBarberReviews
            );
            setBarberReview([]);
            setBarberServices([]);
            setBarberAppointments([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setBarber([]);
        setBarberReview([]);
        setBarberServices([]);
        setBarberAppointments([]);
      }
    };
    fetchAllData();
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle review post
  const handleReviewPost = async (e) => {
    e.preventDefault();
    const toCreateReviewEndpoint = "reviews";
    try {
      const reviewData = { ...formData, barber_id: id, customer_id: id };
      const response = await addItem(toCreateReviewEndpoint, reviewData);
      if (response) {
        console.log("Review Added", response);
        alert("Review posted");
        setFormData(initialize);
        setNotification(null);
      } else {
        console.error("Error adding review");
      }
    } catch (error) {
      console.error("Error creating review", error);
      setNotification(
        error.response?.data?.message || "Unexpected error occurred"
      );
    }
  };

  // Helper function to display star rating
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  // Utility functions for date and time formatting
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minute} ${period}`;
  };



  return (
    <div className="barber-details-container">
      {!barber ? (
        <div>Loading barber details...</div>
      ) : (
        <div className="all-container">
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
              barberReview.map((barberReviews, index) => (
                <div key={index}>
                  <div>
                    <p>Rating: {renderStars(barberReviews.rating)}</p>
                    <p>Comments: {barberReviews.review_text}</p>
                  </div>
                </div>
              ))
            )}
            {notification && (
              <div className="alert alert-danger">{notification}</div>
            )}
            <form onSubmit={handleReviewPost}>
              <div>
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="review_text">Comments</label>
                <input
                  type="text"
                  name="comment"
                  id="review_text"
                  value={formData.review_text}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Review
              </button>
            </form>
          </div>
          <div className="services-container">
            <h4>Services</h4>
            {!barberServices ? (
              <div>Loading services...</div>
            ) : (
              barberServices.map((barberService, index) => (
                <div key={index}>
                  <p>{`${barberService.service_name} = price: ${barberService.price}`}</p>
                </div>
              ))
            )}
          </div>

          <div className="appointments-container">
            <h4>Appointments</h4>
            {!barberAppointments ? (
              <div>Loading appointments...</div>
            ) : (
              barberAppointments.map((appointment, index) => {
                const service = barberServices.find(
                  (service) => service.id === appointment.service_id
                );
                return (
                  <div key={index}>
                    <div>
                      <p>Date: {formatDate(appointment.appointment_date)}</p>
                      <p>Time: {formatTime(appointment.appointment_time)}</p>
                      <p>Status: {appointment.status}</p>
                      <p>
                        Service chooses:{" "}
                        {service
                          ? `${service.service_name} - $${service.price}`
                          : "Service not found"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BarberDetails;
