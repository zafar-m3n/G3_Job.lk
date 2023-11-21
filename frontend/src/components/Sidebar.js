import React from "react";
import { Nav } from "react-bootstrap";
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
    <Nav defaultActiveKey="/home" className="flex-column sidebar py-3">
      <Nav.Link
        href={
          userRole === "freelancer"
            ? "/freelancer-dashboard"
            : "/employer-dashboard"
        }
        className={
          isActive(
            userRole === "freelancer"
              ? "/freelancer-dashboard"
              : "/employer-dashboard"
          )
            ? "active"
            : ""
        }
      >
        <i className="fas fa-home"></i>
        Dashboard
      </Nav.Link>
      <Nav.Link
        href={userRole === "freelancer" ? "/search-job" : "/search-freelancer"}
        className={
          isActive(
            userRole === "freelancer" ? "/search-job" : "/search-freelancer"
          )
            ? "active"
            : ""
        }
      >
        <i className="fas fa-magnifying-glass"></i>
        {userRole === "freelancer" ? "Search Jobs" : "Search Freelancers"}
      </Nav.Link>

      <Nav.Link
        href="/freelancer-clusters"
        className={isActive("/freelancer-clusters") ? "active" : ""}
      >
        <i className="fas fa-users"></i>
        Freelancer Clusters
      </Nav.Link>
      {userRole === "freelancer" && (
        <Nav.Link
          href="/resources"
          className={isActive("/resources") ? "active" : ""}
        >
          <i className="fas fa-book"></i>
          Resources
        </Nav.Link>
      )}
      <Nav.Link
        href="/profile"
        className={isActive("/profile") ? "active" : ""}
      >
        <i className="fas fa-user"></i>
        Profile
      </Nav.Link>
    </Nav>
  );
};

export default Sidebar;
