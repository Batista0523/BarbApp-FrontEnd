import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  fetchOneItem,
  addItem,
  fetchAllItems,
  deleteItem,
  updateItem,
} from "../../helpers/apiCalls";
import "./UserProfile.css";

const UserProfile = ({ onLogOff, formatDate, formatTime }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [initAppointment, setInitAppointment] = useState({
    appointment_date: "",
    appointment_time: "",
    status: "scheduled",
  });
  const [appointmentData, setAppointmentData] = useState(initAppointment);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [barberAppointments, setBarberAppointments] = useState([]);
  const [formServicesData, setFormServicesData] = useState({
    service_name: "",
    price: 0,
  });
  const [formScheduleData, setFormScheduleData] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const userEndpoint = "users";
    const reviewEndpoint = "reviews";
    const servicesEndpoint = "services";
    const appointmentsEndpoint = "appointments";
    const scheduleEndpoint = "schedules";
    const getUserDetails = async () => {
      try {
        if (id) {
          const userDetails = await fetchOneItem(userEndpoint, id);
          if (userDetails.success) {
            setUser(userDetails.payload);
          } else {
            console.error("Invalid response format:", userDetails);
            setUser(null);
          }
          const [
            fetchedReviews,
            fetchedServices,
            fetchedSchedule,
            fetchedCustomers,
            fetchedAppointment,
          ] = await Promise.all([
            fetchAllItems(reviewEndpoint, id),
            fetchAllItems(servicesEndpoint, id),
            fetchAllItems(scheduleEndpoint, id),
            fetchAllItems(userEndpoint),
            fetchAllItems(appointmentsEndpoint, id),
          ]);

          if (
            fetchedReviews.success &&
            fetchedServices.success &&
            fetchedSchedule.success &&
            fetchedCustomers.success &&
            fetchedAppointment.success
          ) {
            setCustomers(fetchedCustomers.payload);
            setReviews(
              fetchedReviews.payload.filter(
                (review) => review.barber_id === Number(id)
              )
            );
            setServices(
              fetchedServices.payload.filter(
                (service) => service.barber_id === Number(id)
              )
            );
            setSchedule(
              fetchedSchedule.payload.filter(
                (schedule) => schedule.barber_id === Number(id)
              )
            );
            setBarberAppointments(
              fetchedAppointment.payload.filter(
                (Appointments) => Appointments.barber_id === Number(id)
              )
            );
          } else {
            console.error(
              "Invalid format",
              fetchedReviews,
              fetchedServices,
              fetchedCustomers,
              fetchedSchedule
            );
            setReviews([]);
            setServices([]);
            setCustomers([]);
            setSchedule([]);
            setBarberAppointments([]);
          }
        }
      } catch (error) {
        console.error("Error fetching specific user", error);
        setUser(null);
        setReviews([]);
        setServices([]);
        setCustomers([]);
        setSchedule([]);
        setBarberAppointments([]);
      }
    };
    getUserDetails();
  }, [id]);
  // Handle delete services
  const handleDeleteServices = (service) => {
    const toDeleteServicesEndpoint = "sevices";
    confirmAlert({
      title: "Confirm to delete",
      message: "Are You Sure You Want To Delete This Service?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteItem(toDeleteServicesEndpoint, service.id);
              setServices(services.filter((s) => s.id !== service.id));
            } catch (err) {
              console.error("Error deleting service", err);
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleEditClick = (service) => {
    setIsEditing(true);
    setEditingService(service);
    setFormServicesData({
      service_name: service.service_name,
      price: service.price,
    });
  };
  // Handle update services
  const handleUpdateServices = async (e) => {
    e.preventDefault();
    const toUpdateServicesEndpoint = "services";
    try {
      const updatedFormData = {
        ...formServicesData,
        barber_id: currentUser.id,
      };
      const updateResponse = await updateItem(
        toUpdateServicesEndpoint,
        editingService.id,
        updatedFormData
      );
      if (updateResponse?.payload?.id) {
        alert("Update successful!!");
        setIsEditing(false);
        setEditingService(null);
        setFormServicesData({ service_name: "", price: 0 });
        setServices(
          services.map((service) =>
            service.id === updateResponse.payload.id
              ? updateResponse.payload
              : service
          )
        );
      } else {
        console.error("Unexpected response format", updateResponse);
        alert("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating the services", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingService(null);
    setFormServicesData({ service_name: "", price: 0 });
  };

  const handleInputServicesChange = (e) => {
    const { id, value } = e.target;
    setFormServicesData((prevData) => ({ ...prevData, [id]: value }));
  };
  // Handle create services
  const handleServicesPost = async (e) => {
    e.preventDefault();
    try {
      const servicesData = { ...formServicesData, barber_id: currentUser.id };
      const response = await addItem("services", servicesData);
      if (response) {
        alert("Service added!");
        setFormServicesData({ service_name: "", price: 0 });
        setServices((prevServices) => [...prevServices, response]);
      } else {
        console.error("Error adding service", response);
      }
    } catch (err) {
      console.error("Error creating service", err);
    }
  };
  // Handle create schedule
  const handleSchedulesPost = async (e) => {
    e.preventDefault();
    try {
      const schedulesData = { ...formScheduleData, barber_id: currentUser.id };
      const response = await addItem("schedules", schedulesData);
      if (response) {
        alert("Schedule added!");
        setFormScheduleData({ day_of_week: "", start_time: "", end_time: "" });
        setSchedule((prevSchedule) => [...prevSchedule, response]);
      } else {
        console.error("Error adding schedule");
      }
    } catch (err) {
      console.error("Error creating schedule", err);
    }
  };

  const handleInputScheduleChange = (e) => {
    const { id, value } = e.target;
    setFormScheduleData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleAppointmentStatusUpdate = async (appointmentId, newStatus) => {
    const toUpdateAppointmentEndpoint = `appointments/${appointmentId}/complete`;
    try {
      const response = await updateItem(toUpdateAppointmentEndpoint, {
        status: newStatus,
      });
      if (response.success) {
        // Update the state to reflect the change
        setBarberAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
        alert("Appointment status updated");
      } else {
        console.error("Error updating appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status", error);
    }
  };

  
  // Handle appointment delete
  const handleAppointmentStatusDelete = (appointmentId) => {
    const toDeleteAppointmentEndpoint = `appointments/${appointmentId}`;
    confirmAlert({
      title: "Confirm to delete",
      message: "Are You Sure You Want To Cancel This Appointment?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await deleteItem(toDeleteAppointmentEndpoint);
              if (response.success) {
                // Update the state to remove the deleted appointment
                setBarberAppointments((prevAppointments) =>
                  prevAppointments.filter(
                    (appointment) => appointment.id !== appointmentId
                  )
                );
                alert("Appointment deleted");
              } else {
                console.error("Error deleting appointment");
              }
            } catch (error) {
              console.error("Error deleting appointment", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };
  const renderStars = (rating) => "⭐".repeat(rating);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return null;

    const totalStars = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalStars / reviews.length;
    return averageRating.toFixed(2);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {user.role === "customer" ? (
        <div className="customer-container">
          <h1>Customer Profile</h1>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Phone: {user.phone_number}</p>
        </div>
      ) : user.role === "barber" ? (
        <div className="barber-container">
          <h1>Barber Profile</h1>
          <p>Name: {user.name}</p>
          <p>Phone: {user.phone_number}</p>
          <p>Email: {user.email}</p>
          <p>
            Your Rating: {`${calculateAverageRating() || "No reviews yet"} ⭐️`}{" "}
          </p>
          <div className="review-container">
            <h4>Your Reviews</h4>
            {reviews.length === 0 ? (
              <div>You have no reviews yet</div>
            ) : (
              reviews.map((review, index) => (
                <div key={index}>
                  <p>Stars: {renderStars(review.rating)}</p>
                  <p>Comments: {review.review_text}</p>
                </div>
              ))
            )}
          </div>
          <div className="service-container">
            <h4>Your Services</h4>
            {services.length === 0 ? (
              <div>You have no services, please add services</div>
            ) : (
              services.map((service, index) => (
                <div key={index}>
                  <p>Service: {service.service_name}</p>
                  <p>Price: {service.price}</p>
                  <button onClick={() => handleDeleteServices(service)}>
                    DELETE
                  </button>
                  <button onClick={() => handleEditClick(service)}>EDIT</button>
                </div>
              ))
            )}
            {isEditing ? (
              <form onSubmit={handleUpdateServices}>
                <div>
                  <label htmlFor="service_name">Service</label>
                  <input
                    type="text"
                    id="service_name"
                    value={formServicesData.service_name}
                    onChange={handleInputServicesChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formServicesData.price}
                    onChange={handleInputServicesChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Service
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <form onSubmit={handleServicesPost}>
                <div>
                  <label htmlFor="service_name">Service</label>
                  <input
                    type="text"
                    id="service_name"
                    value={formServicesData.service_name}
                    onChange={handleInputServicesChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formServicesData.price}
                    onChange={handleInputServicesChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Service
                </button>
              </form>
            )}
          </div>
          <div className="schedule-container">
            <h4>Your Schedule</h4>
            {schedule.length === 0 ? (
              <div>You have no schedules yet</div>
            ) : (
              schedule.map((scheduleItem, index) => (
                <div key={index}>
                  <p>Day: {scheduleItem.day_of_week}</p>
                  <p>Start: {scheduleItem.start_time}</p>
                  <p>End: {scheduleItem.end_time}</p>
                </div>
              ))
            )}
            <form onSubmit={handleSchedulesPost}>
              <div>
                <label htmlFor="day_of_week">Day of the Week</label>
                <input
                  type="text"
                  id="day_of_week"
                  value={formScheduleData.day_of_week}
                  onChange={handleInputScheduleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="start_time">Start Time</label>
                <input
                  type="time"
                  id="start_time"
                  value={formScheduleData.start_time}
                  onChange={handleInputScheduleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="end_time">End Time</label>
                <input
                  type="time"
                  id="end_time"
                  value={formScheduleData.end_time}
                  onChange={handleInputScheduleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Schedule
              </button>
            </form>
          </div>
          <div className="appointment-container">
            <h4>Appointments</h4>
            {!barberAppointments ? (
              <div>Loading appointments...</div>
            ) : (
              barberAppointments.map((appointment, index) => {
                const customer = customers.find(
                  (customer) => customer.id === appointment.customer_id
                );
                return (
                  <div key={index}>
                    <p>Customer name: {customer.name}</p>
                    <p>{`Date: ${formatDate(appointment.appointment_date)}`}</p>
                    <p>{`Time: ${formatTime(appointment.appointment_time)}`}</p>
                    <p>{`Status: ${appointment.status}`}</p>
                    {currentUser.role === "barber" && (
                      <div>
                        <button
                          onClick={() =>
                            handleAppointmentStatusUpdate(
                              appointment.id,
                              "completed"
                            )
                          }
                        >
                          Mark as Completed
                        </button>
                        <button
                          onClick={() =>
                            handleAppointmentStatusDelete(
                              appointment.id,
                              "canceled"
                            )
                          }
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
      <button className="btn btn-primary" onClick={onLogOff}>
        log off
      </button>
    </div>
  );
};

export default UserProfile;
