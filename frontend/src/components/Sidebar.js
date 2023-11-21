import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "../styles/SidebarStyle.css";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => {
    return path === location.pathname;
  };
  return (
    <Nav defaultActiveKey="/home" className="flex-column sidebar py-3">
      <Nav.Link
        href="/freelancer-dashboard"
        className={isActive("/freelancer-dashboard") ? "active" : ""}
      >
        <i class="fas fa-home"></i>
        Dashboard
      </Nav.Link>
      <Nav.Link
        href="/search-job"
        className={isActive("/search-job" ? "active" : "")}
      >
        <i class="fas fa-magnifying-glass"></i>
        Search Job
      </Nav.Link>
      <Nav.Link
        href="/freelancer-clusters"
        className={isActive("/freelancer-clusters" ? "active" : "")}
      >
        <i class="fas fa-users"></i>
        Freelancer Clusters
      </Nav.Link>
      <Nav.Link
        href="/resources"
        className={isActive("/resources" ? "active" : "")}
      >
        <i class="fas fa-book"></i>
        Resources
      </Nav.Link>
      <Nav.Link
        href="/freelancer-profile"
        className={isActive("/freelancer-profile" ? "active" : "")}
      >
        <i class="fas fa-user"></i>
        Profile
      </Nav.Link>
    </Nav>
  );
};

export default Sidebar;
