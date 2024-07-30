import React, { useState, useEffect } from "react";
import { fetchAllItems } from "../helpers/apiCalls";


function CreateAppointments() {
    const [barbers, setBarbers] = useState([]);
    const [customers, setCustomer] = useState([]);
    useEffect(() => {
      const endpoint = "users";
      fetchAllItems(endpoint)
        .then((response) => {
          const barberData = response.payload.filter(
            (user) => user.role === "barber"
          );
          const customerData = response.payload.filter(
            (user) => user.role === "customer"
          );
          setCustomer(customerData);
          setBarbers(barberData);
        })
        .catch((error) => {
          console.error("Error fetching barbers:", error);
        });
    }, []);
  return (
    <div>
      <h1>create appointments</h1>
    </div>
  )
}

export default CreateAppointments
