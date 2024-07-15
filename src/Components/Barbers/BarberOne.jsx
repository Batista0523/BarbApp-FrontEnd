import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOneItem } from '../../helpers/apiCalls'; 

function BarberOne() {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);

  useEffect(() => {
    const endpoint = `users`; 
    const fetchBarberDetails = async () => {
      try {
        if (id) {
          const userDetails = await fetchOneItem(endpoint, id);
      
          if (userDetails.success) {
            setBarber(userDetails.payload);
          } else {
            console.error("Invalid response format:", userDetails);
            setBarber(null);
          }
        }
      } catch (error) {
        console.error('Error fetching barber details:', error);
        setBarber(null); 
      }
    };

    fetchBarberDetails();
  }, [id]); 

  if (!barber) {
    return <div>Loading...</div>; 
  }

  return (
    // need to add inputs to add reviews and appointment to eh specific barber
    <div>
      <h1>{barber.name}'s Details</h1>
      <p>{barber.profile_info}</p>
      <p>{barber.phone_number}</p>
      <p>{barber.address}</p>
    </div>
  );
}

export default BarberOne;
