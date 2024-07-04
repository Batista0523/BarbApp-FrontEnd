import React, { useState } from "react";
import { addItem } from "../../helpers/apiCalls";
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const initialState = {
    name: "",
    username: "",
    password: "",
    email: "",
    role: "",
    profileInfo: "",
    phoneNumber: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const endpoint = "users";

    addItem(endpoint, formData)
      .then((response) => {
        if (response) {
          console.log("Registration successful", response);
          alert("Registration successful"); // Show an alert or message

          // Reset the form
          setFormData(initialState);
          setNotification(null); // Clear any previous error notifications
        } else {
          console.error("Error registering user");
          // Handle registration error
        }
      })
      .catch((error) => {
        console.error("Unexpected error:", error);
        // Handle unexpected error
        if (error.response && error.response.data && error.response.data.message) {
          const { message } = error.response.data;
          setNotification(message);
        } else {
          setNotification("Unexpected error occurred");
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Register</h1>
      {notification && <div className="alert alert-danger">{notification}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-control"
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            value={formData.role}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="barber">Barber</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="profileInfo" className="form-label">Bio</label>
          <input
            type="text"
            id="profileInfo"
            value={formData.profileInfo}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Register;
