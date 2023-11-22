import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-bootstrap";

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
    role: "",
    location: "",
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
      console.log(res.data.user);
      setUserData({
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: res.data.user.profile_image,
        email: res.data.user.email,
        location: res.data.user.district,
        role: res.data.user.user_role,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [jobs, setJobs] = useState([]);

  const getJobData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getJobData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log(res.data);
      setJobs(res.data.Jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const getJobsForDisplay = () => {
    if ([...jobs].reverse() >= 3) {
      return [...jobs].reverse().slice(-3);
    } else {
      return [...jobs].reverse();
    }
  };

  useEffect(() => {
    getUserData();
    getJobData();
  }, []);

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
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
            <Container fluid>
              <Row className="justify-content-between mb-5">
                {/* Top Left Container */}
                <Col
                  md={4}
                  style={{
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  }}
                >
                  <div className="profile-container d-flex flex-column justify-content-center align-items-center">
                    <img
                      src={userData.profileImage}
                      alt="Profile"
                      className="profile-image"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                      }}
                    />
                    <h3 className="text-center">{userData.name}</h3>
                    <p className="text-center">{toTitleCase(userData.role)}</p>
                    <Button variant="outline-primary" className="mb-3">
                      Edit Profile
                    </Button>
                    <p>Location: {userData.location}</p>
                  </div>
                </Col>

                {/* Top Right Container */}
                <Col
                  md={7}
                  style={{
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  }}
                  className="d-flex flex-column align-items-center justify-content-center"
                >
                  <img
                    src="/images/freelancer-icon.jpg"
                    alt="Freelancer Icon"
                    className="mb-4"
                    style={{ width: "200px" }}
                  />
                  <button className="button-custom">Become a freelancer</button>
                </Col>
              </Row>

              <Row className="justify-content-between mb-5">
                {/* Bottom Left Container */}
                <Col
                  md={4}
                  style={{
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  }}
                  className="p-3"
                >
                  <div className="content-placeholder">
                    {/* Description Section */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <h5>Description</h5>
                        <a
                          href="/edit-description"
                          className="text-primary text-decoration-none"
                        >
                          Edit Description
                        </a>
                      </div>
                      <p>
                        {userData.description
                          ? userData.description
                          : "No description available"}
                      </p>
                    </div>

                    {/* Languages Section */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <h5>Languages</h5>
                        <a
                          href="/edit-languages"
                          className="text-primary text-decoration-none"
                        >
                          Edit Languages
                        </a>
                      </div>
                      <p>
                        {userData.languages && userData.languages.length > 0
                          ? userData.languages.join(", ")
                          : "No languages added"}
                      </p>
                    </div>

                    {/* Website Section */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <h5>Website</h5>
                        <a
                          href="/edit-website"
                          className="text-primary text-decoration-none"
                        >
                          Edit Website
                        </a>
                      </div>
                      <p>
                        {userData.website ? (
                          <a
                            href={userData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {userData.website}
                          </a>
                        ) : (
                          "No website link"
                        )}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
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

export default ProfilePage;
