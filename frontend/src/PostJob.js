import React, { useEffect, useState } from "react";
import "./styles/EmployerHomeStyle.css";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Row,
  Col,
  Form,
  Card,
  InputGroup,
  FormControl,
  Carousel,
} from "react-bootstrap";

function EmployerHome() {
  const infoCards = [
    {
      icon: "fas fa-search",
      title: "Browse Services",
      body: "Book a service from a creative that fits your specific needs. Filter by creative field, price, timeline, and more.",
      background: "#0B2447",
      color: "#fffbfe",
    },
    {
      icon: "fas fa-user-check",
      title: "Find Freelancers",
      body: "Find the right candidate for your freelance project. See hundreds of thousands of available freelancers.",
    },
    {
      icon: "fas fa-coins",
      title: "Hire Full Time",
      body: "Discover and recruit qualified full-time verified candidates. Hire global talent across hundreds of creative fields.",
    },
  ];
  const services = [
    { name: "UI/UX Design", image: "/images/uiux-designer.jpg" },
    { name: "Full Stack Development", image: "/images/fullstack-dev.jpg" },
    { name: "QA Engineering", image: "/images/qa-engineer.jpg" },
    { name: "Project Management", image: "/images/project-manager.jpg" },
    { name: "Front-End Development", image: "/images/frontend-dev.jpg" },
    { name: "Back-End Development", image: "/images/backend-dev.jpg" },
    { name: "E-Commerce Development", image: "/images/ecommerce-dev.jpg" },
    {
      name: "Mobile Responsive Design",
      image: "/images/mobile-design.jpg",
    },
  ];
  const chunkServices = (arr, size) =>
    arr.length > size
      ? [arr.slice(0, size), ...chunkServices(arr.slice(size), size)]
      : [arr];

  const serviceGroups = chunkServices(services, 3);
  const [userData, setUserData] = useState({ name: "", profileImage: "" });
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
              <Nav.Link href="/employer-dashboard">Home</Nav.Link>
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
      <Container fluid>
        <Row>
          <Col
            md={3}
            className="p-0 h-100 d-flex flex-column align-self-stretch"
          >
            <Sidebar />
          </Col>

          {/* Main Content Column */}
          <Col md={9} className="py-3 bg-info">
            Post a Job
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

export default EmployerHome;
