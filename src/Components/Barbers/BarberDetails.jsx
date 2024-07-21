import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneItem, addItem, fetchAllItems } from "../../helpers/apiCalls";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
function BarberDetails() {
  const { id } = useParams();
  const [barber, setBarber] = useState([]);
  const [barberReview, setBarberReview] = useState([]);
  const [barberServices, setBarberServices] = useState([]);
  const [barberAppointments, setBarberAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notification, setNotification] = useState(null);
  const [initialize, setInitialize] = useState({ rating: "", review_text: "" });
  const [formData, setFormData] = useState(initialize);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
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

          // Fetch services, appointments, reviews, and customers
          const [
            fetchedBarberServices,
            fetchedBarberAppointments,
            fetchedBarberReviews,
            fetchedCustomers,
          ] = await Promise.all([
            fetchAllItems(servicesEndpoint, id),
            fetchAllItems(appointmentsEndpoint, id),
            fetchAllItems(reviewEndpoint, id),
            fetchAllItems(userEndpoint), // Fetch all users
          ]);

          if (
            fetchedBarberServices.success &&
            fetchedBarberAppointments.success &&
            fetchedBarberReviews.success &&
            fetchedCustomers.success
          ) {
            let Services = fetchedBarberServices.payload;
            let Appointments = fetchedBarberAppointments.payload;
            let Reviews = fetchedBarberReviews.payload;
            let Customers = fetchedCustomers.payload;

            Services = Services.filter(
              (service) => service.barber_id === Number(id)
            );
            Appointments = Appointments.filter(
              (appointment) => appointment.barber_id === Number(id)
            );
            Reviews = Reviews.filter(
              (review) => review.barber_id === Number(id)
            );

            setBarberReview(Reviews);
            setBarberServices(Services);
            setBarberAppointments(Appointments);
            setCustomers(Customers);
          } else {
            console.error(
              "Invalid response format",
              fetchedBarberServices,
              fetchedBarberAppointments,
              fetchedBarberReviews,
              fetchedCustomers
            );
            setBarberReview([]);
            setBarberServices([]);
            setBarberAppointments([]);
            setCustomers([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setBarber([]);
        setBarberReview([]);
        setBarberServices([]);
        setBarberAppointments([]);
        setCustomers([]);
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
      if (!currentUser) {
        alert("Please log in to your account firts");
      }
      const reviewData = {
        ...formData,
        barber_id: id,
        customer_id: currentUser.id,
      };
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
      setNotification(error.response?.data?.message || "Log In first");
      navigate("/login");
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
            <p>Role: {barber.role}</p>
            <p>{barber.profile_info}</p>
            <p>Phone Number: {barber.phone_number}</p>
            <p>Location: {barber.address}</p>
            <p>Email: {barber.email}</p>
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
            <h4>Appointments Deatils</h4>
            {!barberAppointments ? (
              <div>Loading appointments...</div>
            ) : (
              barberAppointments.map((appointment, index) => {
                const service = barberServices.find(
                  (service) => service.id === appointment.service_id
                );
                const customer = customers.find(
                  (customer) => customer.id === appointment.customer_id
                );
                return (
                  <div key={index}>
                    <div>
                      <p>{`${customer.name} has scheduled an appointment with ${
                        barber.name
                      } for the services -${
                        service.service_name
                      } agree to pay the amount of $${
                        service.price
                      } on the day ${formatDate(
                        appointment.appointment_date
                      )} at ${formatTime(appointment.appointment_time)}`}</p>
              
                      {/* <p>
                        Customer:{" "}
                        {customer ? customer.name : appointment.customer_id}
                      </p>
                      <p>Status: {appointment.status}</p>
                      <p>
                        Service chosen:{" "}
                        {service
                          ? `${service.service_name} - $${service.price}`
                          : "Service not found"}
                      </p> */}
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
