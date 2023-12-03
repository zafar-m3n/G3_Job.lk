import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/SidebarStyle.css";

const Sidebar = () => {
  const location = useLocation();

  // Retrieve the role from local storage
  const userRole = JSON.parse(localStorage.getItem("auth"))?.role;

  const isActive = (path) => {
    return path === location.pathname;
  };

  return (
    <div className="flex-column sidebar py-3">
      <a
        href={
          userRole === "freelancer"
            ? "/freelancer-dashboard"
            : "/employer-dashboard"
        }
        className={`nav-link ${
          isActive(
            userRole === "freelancer"
              ? "/freelancer-dashboard"
              : "/employer-dashboard"
          )
            ? "active"
            : ""
        }`}
      >
        <i className="fas fa-home"></i>
        Dashboard
      </a>
      <a
        href={userRole === "freelancer" ? "/search-job" : "/search-freelancer"}
        className={`nav-link ${
          isActive(
            userRole === "freelancer" ? "/search-job" : "/search-freelancer"
          )
            ? "active"
            : ""
        }`}
      >
        <i className="fas fa-magnifying-glass"></i>
        {userRole === "freelancer" ? "Search Jobs" : "Search Freelancers"}
      </a>
      <a
        href="/freelancer-clusters"
        className={`nav-link ${
          isActive("/freelancer-clusters") ? "active" : ""
        }`}
      >
        <i className="fas fa-users"></i>
        Freelancer Clusters
      </a>
      {userRole === "freelancer" && (
        <a
          href="/resources"
          className={`nav-link ${isActive("/resources") ? "active" : ""}`}
        >
          <i className="fas fa-book"></i>
          Resources
        </a>
      )}
      <a
        href="/profile"
        className={`nav-link ${isActive("/profile") ? "active" : ""}`}
      >
        <i className="fas fa-user"></i>
        Profile
      </a>
    </div>
  );
};

export default Sidebar;
