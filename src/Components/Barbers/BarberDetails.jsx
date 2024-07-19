import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneItem, addItem, fetchAllItems } from "../../helpers/apiCalls";

function BarberDetails() {
  // Extract the barber ID from URL parameters
  const { id } = useParams();
  
  // State variables to store data and manage component state
  const [barber, setBarber] = useState([]); // Barber details
  const [barberReview, setBarberReview] = useState([]); // Reviews for the barber
  const [barberServices, setBarberServices] = useState([]); // Services offered by the barber
  const [barberAppointments, setBarberAppointments] = useState([]); // Appointments for the barber
  const [notification, setNotification] = useState(null); // Notification messages for errors or success
  const [initialize, setInitialize] = useState({ rating: "", review_text: "" }); // Initial state for review form
  const [formData, setFormData] = useState(initialize); // State to manage review form data

  // Effect hook to fetch data when component mounts or ID changes
  useEffect(() => {
    const userEndpoint = "users";
    const reviewEndpoint = "reviews";
    const servicesEndpoint = "services";
    const appointmentsEndpoint = "appointments";

    const fetchAllData = async () => {
      try {
        if (id) {
          // Fetch barber details
          const userDetails = await fetchOneItem(userEndpoint, id);
          if (userDetails.success) {
            setBarber(userDetails.payload);
          } else {
            console.error("Invalid response format:", userDetails);
            setBarber([]);
          }

          // Fetch barber services, appointments, and reviews concurrently
          const [
            fetchedBarberServices,
            fetchedBarberAppointments,
            fetchedBarberReviews,
          ] = await Promise.all([
            fetchAllItems(servicesEndpoint, id),
            fetchAllItems(appointmentsEndpoint, id),
            fetchAllItems(reviewEndpoint, id),
          ]);

          // Check if all responses are successful and filter data
          if (
            fetchedBarberServices.success &&
            fetchedBarberAppointments.success &&
            fetchedBarberReviews.success
          ) {
            let Services = fetchedBarberServices.payload;
            let Appointments = fetchedBarberAppointments.payload;
            let Reviews = fetchedBarberReviews.payload;

            // Filter data to include only items related to the current barber
            Services = Services.filter((service) => service.barber_id === Number(id));
            Appointments = Appointments.filter((appointment) => appointment.barber_id === Number(id));
            Reviews = Reviews.filter((review) => review.barber_id === Number(id));

            // Update state with filtered data
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

  // Handle input change for the review form
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle review form submission
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

  // Utility function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Utility function to format time
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
          {/* Barber details */}
          <div className="details-container">
            <h1>{barber.name}'s Details</h1>
            <p>{barber.profile_info}</p>
            <p>{barber.phone_number}</p>
            <p>{barber.address}</p>
          </div>

          {/* Barber reviews */}
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

          {/* Barber services */}
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

          {/* Barber appointments */}
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
                        Service chosen:{" "}
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
