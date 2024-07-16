import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./Components/NAvBar/NavBar";
import Register from "./Components/User/Register";
import Login from "./Components/User/Login";
import Home from "./Pages/Home";
import Appointments from "./Pages/Appointments";
import Reviews from "./Pages/Reviews";
import Barbers from "./Pages/Barbers";
import UserProfile from "./Components/User/UserProfile";
import BarberDetails from "./Components/Barbers/BarberDetails";
function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogOff = () => {
    setUser(null);
  };

  return (
    <Router>
      <NavBar user={user} onLogOff={handleLogOff} />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/barbers" element={<Barbers />} />
          <Route path="/oneBarber/:id" element={<BarberDetails />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/profile/:id" element={<UserProfile onLogOff={handleLogOff} />} />
          <Route path="/login" element={<Login setUser={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
