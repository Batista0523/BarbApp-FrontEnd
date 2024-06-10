import React, { useEffect, useState } from "react";
import {addItem } from "../../helpers/apiCalls";
//temporary code fetching 
function Register() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const endpoint = "users";
    addItem(endpoint)
      .then((response) => {
        if (response.success) {
          setUser(response.payload);
          console.log(response,'response on user')
        } else {
          console.error("error fetchin urser", response);
        }
      })
      .catch((error) => {
        console.error("unpecteted format", error);
      });
  }, []);




  return (
    <div>
      <h1>Register component</h1>
     
        
  
    </div>
  );
}

export default Register;
