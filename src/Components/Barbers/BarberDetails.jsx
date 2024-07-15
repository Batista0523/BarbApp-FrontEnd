import React, { useState, useEffect } from "react";
import { fetchAllItems } from "../../helpers/apiCalls";
import { Link } from "react-router-dom";

function BarberDetails() {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    const endpoint = "users";
    fetchAllItems(endpoint)
      .then((response) => {
        const barberData = response.payload.filter(
          (user) => user.role === "barber"
        );
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
              <p>{barber.profile_info}</p>
              <p>{barber.phone_number}</p>
              <p>{barber.address}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BarberDetails;
