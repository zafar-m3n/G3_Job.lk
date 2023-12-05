import React from "react";
import { Navbar, Nav, Dropdown, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Header({ userData }) {
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };
  return (
    <Navbar className="w-100">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/" className="fs-3 logo-font">
          Job.lk
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navigation and Action Buttons */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          {/* Navigation Links */}
          <Nav>
            {userData && userData.role ? (
              <>
                <Nav.Link href={`/${userData.role}-dashboard`}>Home</Nav.Link>
                <Nav.Link href="/jobs">Jobs</Nav.Link>
                <Nav.Link href="#freelancers">Freelancers</Nav.Link>
                <Nav.Link href="#how-it-works">How it works?</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="#jobs">Jobs</Nav.Link>
                <Nav.Link href="#freelancers">Freelancers</Nav.Link>
                <Nav.Link href="#how-it-works">How it works?</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        {/* Action Buttons */}
        <Nav className="p-0">
          {userData && userData.name ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "5px" }}>{userData.name}</span>
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="upward-dropdown">
                <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Sign Up</Nav.Link>
              <Button className="custom-primary-btn">Contact Us</Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
