import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function NavBar({ user, onLogOff }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/barbers">
            Users
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reviews">
            Reviews
          </Link>
        </li>
        {user ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" to={`/profile/${user.id}`}>
                Welcome {user.username}
              </Link>
            </li>
          
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;