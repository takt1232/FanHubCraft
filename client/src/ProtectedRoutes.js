import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ role, isAuth }) => {
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuth && role === "admin") {
    return <Outlet />;
  }

  // Redirect to a different page or show an unauthorized access message
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
