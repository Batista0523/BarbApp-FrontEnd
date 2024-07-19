import React from "react";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import NavBar from "./Components/NAvBar/NavBar";
import Register from "./Components/User/Register";
import Login from "./Components/User/Login";
import Home from "./Pages/Home";
import { useAuth } from "./AuthContext";
import Reviews from "./Pages/Reviews";
import Barbers from "./Pages/Barbers";
import UserProfile from "./Components/User/UserProfile";
import BarberDetails from "./Components/Barbers/BarberDetails";

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <NavBar user={user} onLogOff={logout} />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/barbers" element={<Barbers />} />
          <Route 
            path="/oneBarber/:id" 
            element={ <BarberDetails />} 
          />
          <Route path="/reviews" element={<Reviews />} />
          <Route 
            path="/profile/:id" 
            element={user ? <UserProfile onLogOff={logout} /> : <Navigate to="/login" />} 
          />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;