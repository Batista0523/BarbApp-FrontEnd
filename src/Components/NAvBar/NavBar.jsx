import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./NAvBar.css"

function Navbar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/appointments">Appointments</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/barbers">Barbers</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/reviews">Reviews</Link></li>
        {user ? (
          <>
            <li className="nav-item"><Link className="nav-link" to={`/profile/${user.id}`}>Profile</Link></li>
            <li className="nav-item"><span className="nav-link">Hello, {user.username}</span></li>
          </>
        ) : (
          <>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
