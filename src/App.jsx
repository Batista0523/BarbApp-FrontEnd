import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import './App.css'
import Home from './Pages/Home';
import Appointments from './Pages/Appointments';
import Barbers from './Pages/Barbers';
import Reviews from './Pages/Reviews';
import Profile from './Pages/Profile';
import Login from './Components/User/Login';
import NavBar from './NAvBar/NavBar';
import Register from './Components/User/Register';




function App() {


  return (
    <div>
       <Router>
      <div className="App">
        <NavBar/>
        <Routes>
          <Route path="/" exact component={Home} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/barbers" component={Barbers} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Routes>
      </div>
    </Router>
    </div>
  )
}

export default App
