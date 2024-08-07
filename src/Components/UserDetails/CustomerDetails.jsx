
//maybe i dont need this component i will leave it here for now 


import React, { useEffect, useState } from "react";
import { fetchAllItems, fetchOneItem } from "../../helpers/apiCalls";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
function CustomerDetails() {
  const [customer, setCustomer] = useState([]);
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  useEffect(() => {
    const customerEndpoint = "users";

    const CustomerData = async () => {
      try {
        if (id) {
          const fecthedCustomer = await fetchOneItem(customerEndpoint, id);
          if (fecthedCustomer.success) {
            setCustomer(fecthedCustomer.payload);
          } else {
            console.error("Invalid response format: ", fecthedCustomer);
          }
        }
      } catch (err) {
        console.error("Error catching the data", err);
      }
    };
    CustomerData();
  }, [id]);

  return (
    <div>
      <h2>customer details</h2>
      <div>
        {!customer ? (
          <div>Loading details</div>
        ) : (
          <div>
            <h3>{customer.email}</h3>
            <h3>{customer.phone_number}</h3>
            <h3>{customer.address}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;