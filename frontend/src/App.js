import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import FreelancerHome from "./FreelancerHome";
import EmployerHome from "./EmployerHome";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PostJob from "./PostJob";
import ProfilePage from "./ProfilePage";
import JobPage from "./JobPage";
import "./App.css";
import JobDetailsEmployer from "./JobDetailsEmployer";
import JobDetailsFreelancer from "./JobDetailsFreelancer";
import BidDetails from "./BidDetails";
import FreelancersPage from "./FreelancersPage";
import Freelancer from "./Freelancer";
import Resources from "./Resources";
import AdminHome from "./AdminHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/freelancer-dashboard"
          element={
            <ProtectedRoute>
              <FreelancerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute>
              <EmployerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-details-employer/:jobId"
          element={
            <ProtectedRoute>
              <JobDetailsEmployer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-details-freelancer/:jobId"
          element={
            <ProtectedRoute>
              <JobDetailsFreelancer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bid-details/:bidId"
          element={
            <ProtectedRoute>
              <BidDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancers"
          element={
            <ProtectedRoute>
              <FreelancersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/:freelancerId"
          element={
            <ProtectedRoute>
              <Freelancer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
