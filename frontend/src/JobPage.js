import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./styles/EmployerHomeStyle.css";
import axios from "axios";
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import JobCard from "./components/JobCard";

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
      const res = await axios.get("https://g3-job-lk.onrender.com/getUserData", {
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
    if (userData.role === "employer") {
      try {
        const res = await axios.get("https://g3-job-lk.onrender.com/getJobData", {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        });
        setJobs(res.data.Jobs);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.get(
          "https://g3-job-lk.onrender.com/getJobDataFreelancer",
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("auth"))?.token
              }`,
            },
          }
        );
        setJobs(res.data.Jobs);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData.role !== "") {
      getJobData();
    }
  }, [userData]);

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
              <h2 className="heading">
                {userData.role === "employer" ? "Posted Jobs" : "Browse Recommended Jobs"}
              </h2>
            </Row>
            <Row>
              {[...jobs].reverse().map((job, index) => (
                <JobCard key={index} job={job} userRole={userData.role} />
              ))}
            </Row>
            <Row>
              <h2 className="heading">
                {userData.role === "employer"
                  ? "Browse Recommended Freelancers"
                  : "Applied Jobs"}
              </h2>
              <p>No applied jobs yet.</p>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default JobPage;
