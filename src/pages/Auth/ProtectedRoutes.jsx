// // src/ProtectedRoute.jsx
// import { useState } from 'react'
// import React from 'react'
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const token = localStorage.getItem("auth_token");

//   return token ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default ProtectedRoute;

// src/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apis from '../../utils/apis';

const ProtectedRoute = () => {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
  const navigate = useNavigate();

  const [status, setStatus] = useState(null); // Track profile status
  const [authToken, setAuthToken]=useState()
  // Fetch the profile from API
  const fetchProfile = async () => {
    try {
      if (!userId) return; // If there's no user_id, skip fetching the profile

      const response = await axios.get(`${apis.get_profile}?user_id=${userId}`);
      console.log(response?.data?.profile);
      if (response?.data?.profile?.status === 0) {
        // If the status is 0, clear localStorage and navigate to login page
        localStorage.clear();
        navigate('/'); // Redirect to login page
      } 
      if(token != response?.data?.profile?.token){
        localStorage.clear();
        navigate("/"); // Redirect to login page
      }
      
      else {
        setStatus(response?.data?.profile?.status);
        setAuthToken(response?.data?.profile?.token);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      localStorage.clear(); // Clear localStorage in case of error and redirect to login page
      navigate('/');
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchProfile(); // Fetch profile if user is logged in
    }
  }, [token, userId, navigate]);

  // If there's no token, redirect to the login page
  if (!token || status === 0) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // If the user is logged in and status is valid, allow access to the child routes
};

export default ProtectedRoute;
