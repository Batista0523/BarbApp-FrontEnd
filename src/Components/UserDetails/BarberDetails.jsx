import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOneItem, addItem, fetchAllItems } from "../../helpers/apiCalls";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

function BarberDetails() {
  const { id } = useParams();
  const [barber, setBarber] = useState([]);
  const [barberReview, setBarberReview] = useState([]);
  const [barberServices, setBarberServices] = useState([]);
  const [barberAppointments, setBarberAppointments] = useState([]);
  const [barberSchedule, setBarberSchedule] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notification, setNotification] = useState(null);
  const [initAppointment, setInitAppointment] = useState({
    appointment_date: "",
    appointment_time: "",
  });
  const [appointmentData, setAppointmentData] = useState(initAppointment);
  const [initialize, setInitialize] = useState({ rating: "", review_text: "" });
  const [formData, setFormData] = useState(initialize);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const userEndpoint = "users";
    const reviewEndpoint = "reviews";
    const servicesEndpoint = "services";
    const appointmentsEndpoint = "appointments";
    const scheduleEndpoint = "schedules";
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
          // Fetch services, appointments, reviews, schedules ,and customers
          const [
            fetchedBarberServices,
            fetchedBarberAppointments,
            fetchedBarberReviews,
            fetchedCustomers,
            fetchedSchedules,
          ] = await Promise.all([
            fetchAllItems(servicesEndpoint, id),
            fetchAllItems(appointmentsEndpoint, id),
            fetchAllItems(reviewEndpoint, id),
            fetchAllItems(userEndpoint),
            fetchAllItems(scheduleEndpoint, id),
          ]);

          if (
            fetchedBarberServices.success &&
            fetchedBarberAppointments.success &&
            fetchedBarberReviews.success &&
            fetchedCustomers.success &&
            fetchedSchedules.success
          ) {
            setCustomers(fetchedCustomers.payload);
            // use Filter method to filter the barber_id and convert the id from string to number
            setBarberReview(
              fetchedBarberReviews.payload.filter(
                (Review) => Review.barber_id === Number(id)
              )
            );
            setBarberServices(
              fetchedBarberServices.payload.filter(
                (Services) => Services.barber_id === Number(id)
              )
            );
            setBarberAppointments(
              fetchedBarberAppointments.payload.filter(
                (Appointments) => Appointments.barber_id === Number(id)
              )
            );
            setBarberSchedule(
              fetchedSchedules.payload.filter(
                (Schedules) => Schedules.barber_id === Number(id)
              )
            );
          } else {
            console.error(
              "Invalid response format",
              fetchedBarberServices,
              fetchedBarberAppointments,
              fetchedBarberReviews,
              fetchedCustomers,
              fetchedSchedules
            );
            setBarberReview([]);
            setBarberServices([]);
            setBarberAppointments([]);
            setCustomers([]);
            setBarberSchedule([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setBarber([]);
        setBarberReview([]);
        setBarberServices([]);
        setBarberAppointments([]);
        setCustomers([]);
        setBarberSchedule([]);
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
        navigate("/login");
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
  //Handle appointment input change
  const handleAppointmentInputChange = (e) => {
    const { id, value } = e.target;
    setAppointmentData({ ...appointmentData, [id]: value });
  };

// Handle appointment post
const handleAppointmentPost = async (e) => {
  e.preventDefault();
  const toPostAppointmentEndpoint = "appointments";
  try {
    if (!currentUser) {
      alert("Please Log in to your account in order to make an appointment");
      navigate("/login");
    }
    const ServerAppointmentData = {
      ...appointmentData,
      barber_id: id,
      customer_id: currentUser.id, 
    };
    const response = await addItem(toPostAppointmentEndpoint, ServerAppointmentData);
    if (response) {
      console.log(response, 'response here');
      alert("Appointment scheduled");
      setAppointmentData(initAppointment);
    } else {
      console.error("Error creating appointment");
    }
  } catch (error) {
    console.error("Internal error front end to create appointment", error);
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
            <p>Information: {barber.profile_info}</p>
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
          <div className="schedule-container">
            <h4>Schedules</h4>
            {!barberSchedule ? (
              <div>Loading schedules...</div>
            ) : (
              barberSchedule.map((schedule, index) => (
                <div key={index}>
                  <p>{schedule.day_of_week}</p>
                  <p>{`From ${schedule.start_time} To ${formatTime(
                    schedule.end_time
                  )}`}</p>
                </div>
              ))
            )}
          </div>
          <div className="post appointment">
            <h4>Make Appointment</h4>
            <form onSubmit={handleAppointmentPost}>
              <div>
                <label htmlFor="appointments">Appointment Date</label>
                <input
                  type="date"
                  name="appointment_date"
                  id="appointment_date"
                  value={appointmentData.appointment_date}
                  onChange={handleAppointmentInputChange}
                />
              </div>
              <div>
                <label htmlFor="appointments">Appointment time</label>
                <input
                  type="time"
                  name="appointment_time"
                  id="appointment_time"
                  value={appointmentData.appointment_time}
                  onChange={handleAppointmentInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Make Appointment</button>
            </form>
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
