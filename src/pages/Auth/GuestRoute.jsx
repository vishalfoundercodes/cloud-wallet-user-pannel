// src/GuestRoute.jsx
import { useState } from 'react'
import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const token = localStorage.getItem("auth_token");

  return token ? <Navigate to="/wallet" replace /> : <Outlet />;
};

export default GuestRoute;
