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
} from "react-bootstrap";

function EmployerHome() {
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
          <Col md={9} className="py-3">
            <Row className="align-items-center justify-content-center mb-4">
              <Col md={10} className="d-flex align-items-center">
                <h2 className="heading">Welcome, {userData.name}</h2>
              </Col>
              <Col className="d-flex align-items-center">
                <Button
                  style={{ backgroundColor: "#0B2447", border: "#0B2447" }}
                >
                  Post a Job
                </Button>
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
            <Row>
              {[
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
                  body: "Find the right candidate for your freelance project. See hundreds of thousands of available web developer freelancers.",
                },
                {
                  icon: "fas fa-coins",
                  title: "Hire Full Time",
                  body: "Discover and recruit qualified full-time verified candidates. Hire global talent across hundreds of creative fields.",
                },
              ].map((card, index) => (
                <Col key={index} md={4} className="mb-4 pe-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <i
                          className={card.icon}
                          style={{ fontSize: "24px" }}
                        ></i>
                        {card.title}
                      </Card.Title>
                      <Card.Text>{card.body}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
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
