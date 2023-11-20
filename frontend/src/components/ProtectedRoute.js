import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const authData = JSON.parse(localStorage.getItem("auth"));
  const token = authData?.token;
  if (token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
