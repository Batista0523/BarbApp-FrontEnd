import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log('User found in localStorage:', storedUser);
      setUser(JSON.parse(storedUser));
    } else {
      console.log('No user found in localStorage');
    }
  }, []);

  const login = (userData) => {
    console.log('Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user in localStorage
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}