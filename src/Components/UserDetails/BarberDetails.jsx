import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchOneItem,
  addItem,
  fetchAllItems,
} from "../../helpers/apiCalls";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

function BarberDetails({formatDate, formatTime ,}) {
  const { id } = useParams();
  const [barber, setBarber] = useState([]);
  const [barberReview, setBarberReview] = useState([]);
  const [initialize, setInitialize] = useState({ rating: 0, review_text: "" });
  const [formData, setFormData] = useState(initialize);
  const [barberServices, setBarberServices] = useState([]);
  const [barberAppointments, setBarberAppointments] = useState([]);
  const [barberSchedule, setBarberSchedule] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notification, setNotification] = useState(null);
  const [initAppointment, setInitAppointment] = useState({
    appointment_date: "",
    appointment_time: "",
    status: "scheduled",
  });
  const [appointmentData, setAppointmentData] = useState(initAppointment);
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
          // Fetch services, appointments, reviews, schedules, and customers
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
            // Use Filter method to filter the barber_id and convert the id from string to number
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
        alert("Please log in to your account first");
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

  // Handle appointment input change
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
        alert("Please log in to your account in order to make an appointment");
        navigate("/login");
      }
      const ServerAppointmentData = {
        ...appointmentData,
        barber_id: id,
        customer_id: currentUser.id,
      };
      const response = await addItem(
        toPostAppointmentEndpoint,
        ServerAppointmentData
      );
      if (response) {
        console.log(response, "response here");
        alert("Appointment scheduled");
        setAppointmentData(initAppointment);
      } else {
        console.error("Error creating appointment");
      }
    } catch (error) {
      console.error("Internal error front end to create appointment", error);
    }
  };

  // Handle appointment status update
// const handleAppointmentStatusUpdate = async (appointmentId, newStatus) => {
//   const toUpdateAppointmentEndpoint = `appointments/${appointmentId}/complete`;
//   try {
//     const response = await updateItem(toUpdateAppointmentEndpoint, {
//       status: newStatus,
//     });
//     if (response.success) {
//       // Update the state to reflect the change
//       setBarberAppointments((prevAppointments) =>
//         prevAppointments.map((appointment) =>
//           appointment.id === appointmentId
//             ? { ...appointment, status: newStatus }
//             : appointment
//         )
//       );
//       alert("Appointment status updated");
//     } else {
//       console.error("Error updating appointment status");
//     }
//   } catch (error) {
//     console.error("Error updating appointment status", error);
//   }
// };

// // Handle appointment delete
// const handleAppointmentStatusDelete = async (appointmentId) => {
//   const toDeleteAppointmentEndpoint = `appointments/${appointmentId}`;
//   try {
//     const response = await deleteItem(toDeleteAppointmentEndpoint);
//     if (response.success) {
//       // Update the state to remove the deleted appointment
//       setBarberAppointments((prevAppointments) =>
//         prevAppointments.filter(
//           (appointment) => appointment.id !== appointmentId
//         )
//       );
//       alert("Appointment deleted");
//     } else {
//       console.error("Error deleting appointment");
//     }
//   } catch (error) {
//     console.error("Error deleting appointment", error);
//   }
// };


  // Helper function to display star rating
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
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
                    <p>{`posted ${formatDate(barberReviews.created_at)}`}</p>
                   
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
                  <p>{`From ${formatTime(schedule.start_time)} To ${formatTime(
                    schedule.end_time
                  )}`}</p>
                </div>
              ))
            )}
          </div>
    
          <div className="post-appointment">
            <h4>Make Appointment</h4>
            <form onSubmit={handleAppointmentPost}>
              <div>
                <label htmlFor="appointment_date">Date</label>
                <input
                  type="date"
                  id="appointment_date"
                  value={appointmentData.appointment_date}
                  onChange={handleAppointmentInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="appointment_time">Time</label>
                <input
                  type="time"
                  id="appointment_time"
                  value={appointmentData.appointment_time}
                  onChange={handleAppointmentInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Schedule Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarberDetails;
