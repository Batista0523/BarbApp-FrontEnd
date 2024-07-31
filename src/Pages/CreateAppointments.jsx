import React, { useState, useEffect } from "react";
import { fetchAllItems, fetchOneItem } from "../helpers/apiCalls";
import { useParams } from "react-router-dom";

function CreateAppointments() {
  const { id } = useParams();
  const [barbers, setBarbers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [fetchedBarber, setFetchedBarber] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const endpoint = "users";
      try {
        const response = await fetchAllItems(endpoint);
        if (response.success) {
          const barberData = response.payload.filter(
            (user) => user.role === "barber"
          );
          const customerData = response.payload.filter(
            (user) => user.role === "customer"
          );
          setBarbers(barberData);
          setCustomers(customerData);
        } else {
          console.error("Error fetching users:", response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchBarberById = async () => {
      const endpoint = "users";
      if (id === '') {
          console.log(id, "id here");
        Number(id)
        try {
          const response = await fetchOneItem(endpoint, id);
          if (response.success) {
            console.log(response, id, "response");
            setFetchedBarber(
              response.payload.filter(
                (barberById) => barberById.barber_id === Number(id)
              )
            );
          } else {
            console.error("Error fetching specific barber:", response);
            setFetchedBarber([]);
          }
        } catch (error) {
          console.error("Internal error:", error);
          setFetchedBarber([]);
        }
      }
    };

    fetchUsers();
    fetchBarberById();
  }, [id]);

  return (
    <div>
      <h1>Create Appointments</h1>
      {fetchedBarber.length ? (
        fetchedBarber.map((barber, index) => (
          <div key={index}>
            <p>{`Hi, my name is ${barber.name}`}</p>
          </div>
        ))
      ) : (
        <p>Loading barbers...</p>
      )}
    </div>
  );
}

export default CreateAppointments;
