import React, { useState, useEffect } from "react";
import { fetchAllItems } from "../../helpers/apiCalls";
import { Link } from "react-router-dom";

function Barbers() {
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
      <h1>Barbers</h1>
      <ul>
        {barbers.map((barber) => (
          <li key={barber.id}>
            <Link to={`/oneBarber/${barber.id}`}>
              <h2>{barber.name}</h2>
            </Link>
          </li>
        ))}
      </ul>
      <h1>clients</h1>
      {/* need to create clients details component */}
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <Link to={`/oneCustomer/${customer.id}`}>
              <h2>{customer.name}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Barbers;
