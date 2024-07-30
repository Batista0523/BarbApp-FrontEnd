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
import "./UserProfile.css";
const UserProfile = ({ onLogOff }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { user: currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [initService, setInitServices] = useState({
    service_name: "",
    price: 0,
  });
  const [formServicesData, setFormServicesData] = useState(initService);
  const [schedule, setSchedule] = useState([]);
  const [initSchedule, setInitSchedule] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [formScheduleData, setFormScheduleData] = useState(initSchedule);
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

  // Handle edit click
  const handleEditClick = (service) => {
    setIsEditing(true);
    setEditingService(service);
    setFormServicesData({
      service_name: service.service_name,
      price: service.price,
    });
  };
  // Handle update service
  const handleUpdateServices = async (e) => {
    e.preventDefault();
    const toUpdateEndpoint = "services";
    try {
      const updatedFormData = {
        ...formServicesData,
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
        setFormServicesData(initService);
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
  // Handle cancel click
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingService(null);
    setFormServicesData({ service_name: "", price: 0 });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormServicesData({ ...formServicesData, [id]: value });
  };
  // Handle create services
  const handleServicesPost = async (e) => {
    e.preventDefault();

    const toPostServicesEndpoint = "services";
    try {
      const servicesData = {
        ...formServicesData,
        barber_id: currentUser.id,
      };

      const response = await addItem(toPostServicesEndpoint, servicesData);
      if (response) {
        console.log("Services added to your profile");
        alert("Service added!");
        setFormServicesData(initService);
        setServices((prevServices) => [...prevServices, response]);
      } else {
        console.error("Error adding service", response);
      }
    } catch (err) {
      console.error("Error creating service", err);
    }
  };

  const handleSchedulesPost = async (e) => {
    e.preventDefault();

    const toPostSchedulesEndpoint = "schedules";
    try {
      const schedulesData = {
        ...formScheduleData,
        barber_id: currentUser,
      };
      const response = await addItem(toPostSchedulesEndpoint, schedulesData);
      if (response) {
        console.log("Schedule added to your profile");
        setFormScheduleData(initSchedule);
        setSchedule((prevSchedule) => [...prevSchedule, response]);
      } else {
        console.error("Error adding schedule");
      }
    } catch (err) {
      console.error("error creating schedule", err);
    }
  };

  // Handle stars render
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
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
              <div>You have no Reviews yet</div>
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
              <div>You have no services please add services</div>
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
                    value={formServicesData.service_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formServicesData.price}
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
                    value={formServicesData.service_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formServicesData.price}
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
      <button onClick={onLogOff}>Log off</button>
    </div>
  );
};

export default UserProfile;
