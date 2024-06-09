import React from 'react';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import './App.css'
import Home from './Pages/Home';
import Appointments from './Pages/Appointments';
import Barbers from './Pages/Barbers';
import Reviews from './Pages/Reviews';
import Profile from './Pages/Profile';
import Login from './Components/User/Login';
import NavBar from './Components/NAvBar/NavBar';
import Register from './Components/User/Register';




function App() {


  return (
    <div>
       <Router>
      <div className="App">
        <NavBar/>
        <Routes>
          <Route path="/"  element={<Home/>} />
          <Route path="/appointments" element={<Appointments/>} />
          <Route path="/barbers" element={<Barbers/>} />
          <Route path="/reviews" element={<Reviews/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </div>
    </Router>
    </div>
  )
}

export default App
