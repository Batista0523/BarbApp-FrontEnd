import React from "react";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import NavBar from "./Components/NAvBar/NavBar";
import Register from "./Components/Profile/Register";
import Login from "./Components/Profile/Login";
import Home from "./Pages/Home";
import { useAuth } from "./AuthContext";
import Reviews from "./Pages/Reviews";
import Barbers from "./Pages/Barbers";
import UserProfile from "./Components/Profile/UserProfile";
import BarberDetails from "./Components/UserDetails/BarberDetails";
import CustomerDetails from "./Components/UserDetails/CustomerDetails";
// import CreateAppointments from "./Pages/CreateAppointments";
function App() {
  const { user, logout } = useAuth();
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minute} ${period}`;
  };

  // const calculateAverageRating = (reviews) => {
  //   if (reviews.length === 0) return null;

  //   const totalStars = reviews.reduce((acc, review) => acc + review.rating, 0);
  //   const averageRating = totalStars / reviews.length;
  //   return averageRating.toFixed(2);
  // };

  return (
    <Router>
      <NavBar user={user} onLogOff={logout} />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/barbers" element={<Barbers />} />
          <Route 
            path="/oneBarber/:id" 
            element={ <BarberDetails formatDate={formatDate} formatTime={formatTime} />} 
          />
          <Route 
            path="/oneCustomer/:id" 
            element={ <CustomerDetails />} 
          />
          <Route path="/reviews" element={<Reviews />} />
          <Route 
            path="/profile/:id" 
            element={user ? <UserProfile formatDate={formatDate} formatTime={formatTime} onLogOff={logout} /> : <Navigate to="/login" />} 
          />
          {/* <Route path="/createAppointment/:id" element={<CreateAppointments/>}/> */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;