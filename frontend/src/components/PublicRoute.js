import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const authData = JSON.parse(localStorage.getItem("auth"));
  const token = authData?.token;
  const role = authData?.role;

  if (token) {
    if (role === "freelancer") {
      return <Navigate to="/freelancer-dashboard" />;
    } else {
      return <Navigate to="/employer-dashboard" />;
    }
  } else {
    return children;
  }
}
