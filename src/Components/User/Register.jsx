import React, { useState } from "react";
import { addItem } from "../../helpers/apiCalls";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [profileInfo, setProfileInfo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = {
      name,
      username,
      password,
      email,
      role,
      profile_info: profileInfo,
      phone_number: phoneNumber,
      address,
    };

    const endpoint = "users"; // Endpoint should be defined inside handleRegister

    addItem(endpoint, userData)
      .then((response) => {
        if (response) {
          console.log("Registration successful", response);
          // Handle successful registration, e.g., redirect or show success message
        } else {
          console.error("Error registering user");
          // Handle registration error
        }
      })
      .catch((error) => {
        console.error("Unexpected error:", error);
        // Handle unexpected error
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          setNotification(message);
        } else {
          setNotification("Registration failed due to an unexpected error.");
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <h1>Register</h1>
      {notification && <div style={{ color: "red" }}>{notification}</div>}
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>
              <input
                type="checkbox"
                onChange={togglePasswordVisibility}
                style={{ marginLeft: "10px" }}
              />
              Show Password
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="barber">Barber</option>
          </select>
        </div>
        <div>
          <label htmlFor="profileInfo">Bio</label>
          <input
            type="text"
            id="profileInfo"
            value={profileInfo}
            onChange={(e) => setProfileInfo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
