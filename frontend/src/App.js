import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import FreelancerHome from "./FreelancerHome";
import EmployerHome from "./EmployerHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/freelancer-dashboard" element={<FreelancerHome />} />
        <Route path="/employer-dashboard" element={<EmployerHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
