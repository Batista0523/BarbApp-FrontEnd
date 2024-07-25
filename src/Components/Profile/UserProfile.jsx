import React, { useState, useEffect } from "react";
import {
  fetchOneItem,
  addItem,
  fetchAllItems,
  deleteItem,
} from "../../helpers/apiCalls";
import { useParams, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "../../AuthContext";
const UserProfile = ({ onLogOff }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { user: currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [initialize, setInitialize] = useState({ service_name: "", price: 0 });
  const [formData, setFormData] = useState(initialize);
  useEffect(() => {
    const endpoint = "users";
    const reviewEndpoint = "reviews";
    const servicesEndpoint = "services";
    const getUserDetails = async () => {
      try {
        if (id) {
          const userDetails = await fetchOneItem(endpoint, id);

          if (userDetails.success) {
            setUser(userDetails.payload);
          } else {
            console.error("Invalid response format:", userDetails);
            setUser(null);
          }
          const [fetchedReviews, fetchedServices] = await Promise.all([
            fetchAllItems(reviewEndpoint, id),
            fetchAllItems(servicesEndpoint, id),
          ]);
          if (fetchedReviews.success && fetchedServices.success) {
            let fetcheReviewById = fetchedReviews.payload;
            let fetcheServicesById = fetchedServices.payload;

            fetcheServicesById = fetcheServicesById.filter((serviceById) => {
              return serviceById.barber_id === Number(id);
            });
            fetcheReviewById = fetcheReviewById.filter((reviewById) => {
              return reviewById.barber_id === Number(id);
            });
            setReviews(fetcheReviewById);
            setServices(fetcheServicesById);
          } else {
            console.error("Ivalid format", fetchedReviews);
            setReviews([]);
          }
        }
      } catch (error) {
        console.error("Error fetching specific user", error);
        setUser(null);
        setReviews([]);
        setServices([]);
      }
    };

    getUserDetails();
  }, [id]);
  //Hanlde deleting of service
  const handleDeleteServices = (service) => {

    const toDeleteEndpoint = "services"
    confirmAlert({
      title: "Confirm to delete",
      message: "Are You Sure You Want To Delete This Service My friend?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteItem(toDeleteEndpoint, service.id);
              setServices(services.filter((s) => s.id !== service.id));
              console.log("Service deleted successfully");
            } catch (err) {
              console.error("Error deleting service", err);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  //Handle input Change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleServicesPost = async (e) => {
    e.preventDefault();

    const toPostServicesEndpoint = "services";
    try {
      const servicesData = {
        ...formData,
        barber_id: currentUser.id,
      };

      const response = await addItem(toPostServicesEndpoint, servicesData);
      if (response) {
        console.log("Services added to to your profile");
        alert("service added niceee!!!");

        setFormData(initialize);
      } else {
        console.error("error adding service", response);
      }
    } catch (err) {
      console.error("error creating service", err);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const handleLogOff = () => {
    setUser(null);
    onLogOff(); // Call log-off function from props to update NavBar
    navigate("/"); // Send user home
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user.role === "customer" ? (
        <div className="customer-container">
          <h1>customer profile</h1>
          <p>Name {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>phone: {user.phone_number}</p>
        </div>
      ) : user.role === "barber" ? (
        <div className="barber contains">
          <h1>Barber profile</h1>
          <p>Name:{user.name}</p>
          <p>Phone number {user.phone_number}</p>
          <p>Email:{user.email}</p>
          <div className="review-container">
            <h4> Your reviews</h4>
            {!reviews ? (
              <div>loading review...</div>
            ) : (
              reviews.map((reviews, index) => (
                <div key={index}>
                  <p>review {renderStars(reviews.rating)}</p>
                  <p>review --- {reviews.review_text}</p>
                </div>
              ))
            )}

            {!services ? (
              <div>loading services</div>
            ) : (
              services.map((services, index) => (
                <div key={index}>
                  <p>services : {services.service_name}</p>
                  <p>price : {services.price}</p>
                <button onClick={() => handleDeleteServices(services)}>DELETE</button>
                </div>
              ))
            )}
            <form onSubmit={handleServicesPost}>
              <div>
                <label htmlFor="service_price"> price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="service_name"> Service</label>
                <input
                  type="text"
                  name="service_name"
                  id="service_name"
                  value={formData.service_name}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add services
              </button>
            </form>
          </div>
        </div>
      ) : null}
      <button onClick={handleLogOff} className="btn btn-danger">
        Log Off
      </button>
    </div>
  );
};

export default UserProfile;
