import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  fetchOneItem,
  addItem,
  fetchAllItems,
  deleteItem,
  updateItem,
} from "../../helpers/apiCalls";
import "./UserProfile.css"
const UserProfile = ({ onLogOff }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { user: currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [initialize, setInitialize] = useState({ service_name: "", price: 0 });
  const [formData, setFormData] = useState(initialize);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState(null);

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
            console.error("Invalid format", fetchedReviews);
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

  // Handle deleting of service
  const handleDeleteServices = (service) => {
    const toDeleteEndpoint = "services";
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

  // Handle update service
  const handleEditClick = (service) => {
    setIsEditing(true);
    setEditingService(service);
    setFormData({ service_name: service.service_name, price: service.price });
  };

  const handleUpdateServices = async (e) => {
    e.preventDefault();
    const toUpdateEndpoint = "services";
    try {
      const updatedFormData = {
        ...formData,
        barber_id: currentUser.id,
      };
      const updateServices = await updateItem(
        toUpdateEndpoint,
        editingService.id,
        updatedFormData
      );
      if (updateServices?.payload?.id) {
        alert("Update successful!!");
        setIsEditing(false);
        setEditingService(null);
        setFormData(initialize);
        setServices((prevSetServices) =>
          prevSetServices.map((service) =>
            service.id === updateServices.payload.id
              ? updateServices.payload
              : service
          )
        );
      } else {
        console.error("Unexpected response format", updateServices);
        alert("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating the services", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingService(null);
    setFormData({ service_name: "", price: 0 });
  };

  // Handle input change
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
        console.log("Services added to your profile");
        alert("Service added!");
        setFormData(initialize);
        setServices((prevServices) => [...prevServices, response]);
      } else {
        console.error("Error adding service", response);
      }
    } catch (err) {
      console.error("Error creating service", err);
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
          <h1>Customer Profile</h1>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Phone: {user.phone_number}</p>
        </div>
      ) : user.role === "barber" ? (
        <div className="barber-container">
          <h1>Barber Profile</h1>
          <p>Name: {user.name}</p>
          <p>Phone: {user.phone_number}</p>
          <p>Email: {user.email}</p>
          <div className="review-container">
            <h4>Your Reviews</h4>
            {reviews.length === 0 ? (
              <div>Loading reviews...</div>
            ) : (
              reviews.map((review, index) => (
                <div key={index}>
                  <p>Rating: {renderStars(review.rating)}</p>
                  <p>Review: {review.review_text}</p>
                </div>
              ))
            )}
          </div>
          <div className="service-container">
            <h4>Your Services</h4>
            {services.length === 0 ? (
              <div>Loading services...</div>
            ) : (
              services.map((service, index) => (
                <div key={index}>
                  <p>Service: {service.service_name}</p>
                  <p>Price: {service.price}</p>
                  <button onClick={() => handleDeleteServices(service)}>
                    DELETE
                  </button>
                  <button onClick={() => handleEditClick(service)}>EDIT</button>
                </div>
              ))
            )}
            {isEditing && (
              <form onSubmit={handleUpdateServices}>
                <div>
                  <label htmlFor="service_name">Service</label>
                  <input
                    type="text"
                    id="service_name"
                    value={formData.service_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Service
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </form>
            )}
            {!isEditing && (
              <form onSubmit={handleServicesPost}>
                <div>
                  <label htmlFor="service_name">Service</label>
                  <input
                    type="text"
                    id="service_name"
                    value={formData.service_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Add Service
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
      <button onClick={handleLogOff}>Log off</button>
    </div>
  );
};

export default UserProfile;


