import React, { useEffect, useState } from "react";
import "./styles/FreelancerHomeStyle.css";
import axios from "axios";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Sidebar from "./components/Sidebar";

function FreelancerHome() {
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
  });
  const getUserData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getUserData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      setUserData({
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: res.data.user.profile_image,
        email: res.data.user.email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
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
              <Nav.Link href="/freelancer-dashboard">Home</Nav.Link>
              <Nav.Link href="#jobs">Jobs</Nav.Link>
              <Nav.Link href="#freelancers">Freelancers</Nav.Link>
              <Nav.Link href="#how-it-works">How it works?</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {/* Action Buttons */}
          <Nav>
            {/* Display User Name and Profile Image if available */}
            {userData.name && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    marginRight: "5px",
                  }}
                >
                  {userData.name}
                </span>
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
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container fluid className="bg-warning">
        <Row className="bg-warning">
          <Col md={3} className="p-0">
            <Sidebar />
          </Col>

          {/* Main Content Column */}
          <Col md={9} className="py-3 bg-info">
            {/* Your main content goes here */}
            <Col className="align-items-center justify-content-center mb-4">
              <Row>
                <Col md={10} className="d-flex align-items-center">
                  <h2 className="heading">Welcome, {userData.name}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={9}>
                  <InputGroup className="mb-3 rounded">
                    <FormControl
                      placeholder="Browse freelancers that are tailored to you"
                      aria-label="Browse freelancers"
                    />
                    <Button variant="outline-secondary" id="button-addon2">
                      <i className="fas fa-search"></i>
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Col>
            <Col className="align-items-center justify-content-center mb-4">
              <Row>
                <h2 className="heading">
                  Your Current Jobs and Recommendations
                </h2>
              </Row>
              <Row>
                <h4 className="sub-heading">Active Bids</h4>
              </Row>
              <Row>
                <h4 className="sub-heading">Recommended Jobs For You</h4>
              </Row>
            </Col>
            <Col className="align-items-center justify-content-center mb-4">
              <Row>
                <h2 className="heading">Learn with Job.lk</h2>
              </Row>
            </Col>
            <Col className="align-items-center justify-content-center mb-4">
              <Row>
                <h2 className="heading">How to get verified?</h2>
              </Row>
            </Col>
          </Col>
        </Row>
      </Container>
      <Container fluid className="px-5 py-3 fifth-section">
        <Row className="bg-transparent">
          {/* First Column - Logo and About */}
          <Col md={5} className="mx-auto mb-3 bg-transparent">
            <Navbar.Brand href="/" className="fs-3 footer-logo bg-transparent">
              Job.lk
            </Navbar.Brand>
            <p className="footer-content">
              Job.lk is a specialized freelance platform tailored for web
              developer freelancers in Sri Lanka. Our platform serves as a
              dynamic marketplace, connecting talented web developers with a
              diverse range of opportunities. Whether you are a skilled web
              developer seeking exciting projects or an employer searching for
              top-notch web development expertise, Job.lk is your go-to
              destination. Discover the perfect match for your project or
              showcase your skills to a local and global audience, all on
              Job.lk, the premier choice for web development freelancers in Sri
              Lanka.
            </p>
          </Col>

          {/* Second Column - Quick Links */}
          <Col md={3} className="mx-auto mb-3 bg-transparent">
            <h5 className="footer-content">Quick Links</h5>
            <Nav className="footer-content">
              <Col className="footer-content">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="#jobs">Jobs</Nav.Link>
                <Nav.Link href="#freelancers">Freelancers</Nav.Link>
                <Nav.Link href="#how-it-works">How it works?</Nav.Link>
              </Col>
            </Nav>
          </Col>

          {/* Third Column - Contact / Subscription Form */}
          <Col md={3} className="mx-auto mb-3 bg-transparent">
            <h5 className="footer-content">Get in touch</h5>
            <Form className="footer-content">
              <Form.Group className="mb-3 rounded" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group className="mb-3 rounded" controlId="formBasicName">
                <Form.Control type="text" placeholder="Your Name" />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="custom-primary-btn"
              >
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        <h5 className="footer-content text-center">
          CCG3 All Rights Reserved.
        </h5>
      </Container>
    </>
  );
}

export default FreelancerHome;
