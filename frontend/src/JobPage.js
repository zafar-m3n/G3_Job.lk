import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./styles/EmployerHomeStyle.css";
import axios from "axios";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

function JobPage() {
  // const navigate = useNavigate();
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

  useEffect(() => {
    getUserData();
    getJobData();
  }, []);
  return (
    <>
      <Header userData={userData} />
      <Container fluid>
        <Row>
          <Col
            md={3}
            className="p-0"
            style={{
              backgroundColor: "#0B2447",
            }}
          >
            <Sidebar />
          </Col>
          <Col md={9}>
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
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default JobPage;
