import React, { useState, useEffect } from 'react';
import { fetchOneItem, fetchAllItems } from '../../helpers/apiCalls';

const CustomerUserProfile = ({ userId }) => {
  const [user, setUser] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch customer's own user data
        const endpoint = 'users';
        const userData = await fetchOneItem(endpoint).then((response) => {
          if (response.success) {
            setUser(userData.payload)
          }else {
            console.error("Unexpected response format", response);
          }
          console.log(userData , 'userdata here')
        });
      
   

        // Fetch all appointments made by the customer
        const appointmentsEndpoint = 'appointments';
        console.log(customerAppointments,'---')// Assuming customerAppointments is an array
        setAppointments(customerAppointments); 
        const customerAppointments = await fetchAllItems(`${appointmentsEndpoint}?customer_id=${userId}`);
      } catch (error) {
        console.error('Error fetching user data:----', error);
      }
    };

    fetchUserData();
  }, []);

 

  return (
    <div>
      {/* <h2>Customer Profile</h2>
      <div>
        <h3>User Information</h3>
   
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Phone Number: {user.phone_number}</p>
        <p>Address: {user.address}</p>
        <p>Profile Info: {user.profile_info}</p>
      </div>
      <div>
        <h3>Appointments</h3>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <p>Barber ID: {appointment.barber_id}</p>
              <p>Service ID: {appointment.service_id}</p>
              <p>Date: {new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p>Time: {appointment.appointment_time}</p>
              <p>Status: {appointment.status}</p>
              <hr />
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default CustomerUserProfile;
