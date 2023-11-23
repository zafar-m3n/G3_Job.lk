import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/EmployerHomeStyle.css";
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
  Dropdown,
} from "react-bootstrap";

function JobPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
    role: "",
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
        role: res.data.user.user_role,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [jobs, setJobs] = useState([]);

  const getJobData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/getJobDataFreelancer",
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log(res.data);
      setJobs(res.data.Jobs);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  useEffect(() => {
    getUserData();
    getJobData();
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
              <Nav.Link href={`/${userData.role}-dashboard`}>Home</Nav.Link>
              <Nav.Link href="#jobs">Jobs</Nav.Link>
              <Nav.Link href="#freelancers">Freelancers</Nav.Link>
              <Nav.Link href="#how-it-works">How it works?</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {/* Action Buttons */}
          <Nav className="p-0">
            {userData.name && (
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
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container fluid>
        <Row
          style={{
            backgroundColor: "#0B2447",
          }}
        >
          <Row>
            <Col md={9}>
              <InputGroup className="mb-3 rounded">
                <FormControl
                  placeholder="Browse jobs"
                  aria-label="Browse jobs"
                />
                <Button variant="outline-secondary" id="button-addon2">
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup>
            </Col>
          </Row>

          <Row>
            <h2 className="heading">Most Popular Jobs in Web Development</h2>
          </Row>
          <Row>
            {jobs.map((job, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    {/* Job Title and Experience Level */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title>{job.jobTitle}</Card.Title>
                      <span
                        className={`badge ${
                          job.experienceLevel === "Beginner"
                            ? "bg-info"
                            : job.experienceLevel === "Intermediate"
                            ? "bg-secondary"
                            : "bg-success"
                        }`}
                      >
                        {job.experienceLevel}
                      </span>
                    </div>

                    {/* Budget, Duration, Location */}
                    <div className="d-flex justify-content-start text-secondary mb-3">
                      <div style={{ margin: "auto" }}>
                        <div>LKR {job.estimatedBudget}</div>
                        <div style={{ fontSize: "0.6em" }}>Budget</div>
                      </div>
                      <div style={{ margin: "auto" }}>
                        <div>{job.projectDuration}</div>
                        <div style={{ fontSize: "0.6em" }}>Duration</div>
                      </div>
                      <div style={{ margin: "auto" }}>
                        <div>{job.location}</div>
                        <div style={{ fontSize: "0.6em" }}>Location</div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <Card.Text>
                      {job.jobDescription.length > 100
                        ? job.jobDescription.substring(0, 100) + "..."
                        : job.jobDescription}
                    </Card.Text>

                    {/* Skills */}
                    <div className="mb-3">
                      <strong>Skills:</strong> {job.requiredSkills}
                    </div>
                  </Card.Body>

                  {/* See More Button */}
                  {/* <Card.Footer>
                        <Button variant="primary" block>
                          See More
                        </Button>
                      </Card.Footer> */}
                </Card>
              </Col>
            ))}
          </Row>
          <Row>
            <h2 className="heading">Endorsed Jobs</h2>
            <p>No endorsed jobs yet.</p>
          </Row>
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

export default JobPage;
