import React, { useEffect, useState } from "react";
import { fetchAllItems } from "../../helpers/apiCalls";
import './AppointmentsAvailable.css'

function AppointmentsAvailable() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const endpoint = "appointments";
    fetchAllItems(endpoint)
      .then((response) => {
        if (response.success) {
          setAppointments(response.payload);
        } else {
          console.error("Unexpected response format", response);
        }
        console.log(response, "---");
      })
      .catch((error) => {
        console.error("Error fetching appointments", error);
      });
  }, []);

  return (
    <div className="appointments-container">
      <h3 className="appointments-title">Appointments</h3>
      <ul className="appointments-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="appointment-item">
            <h2 className="appointment-customer">Customer ID: {appointment.customer_id}</h2>
            <p className="appointment-with">with</p>
            <h2 className="appointment-barber">Barber ID: {appointment.barber_id}</h2>
            <p className="appointment-date">
              Date: {new Date(appointment.appointment_date).toLocaleDateString()}
            </p>
            <p className="appointment-time">Time: {appointment.appointment_time}</p>
            <p className="appointment-status">Status: {appointment.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentsAvailable;
