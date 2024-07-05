import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../../helpers/apiCalls';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const endpoint = 'users/login'; 

    try {
      const response = await addItem(endpoint, { username, password });

  
      setUser(response); 
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Log In</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Log In</button>
      </form>
    </div>
  );
}

export default Login;
