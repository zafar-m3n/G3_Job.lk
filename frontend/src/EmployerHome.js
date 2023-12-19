import React, { useEffect, useState } from "react";
import "./styles/EmployerHomeStyle.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import JobCard from "./components/JobCard";
import ServiceCarousel from "./components/ServiceCarousel";
import Footer from "./components/Footer";

function EmployerHome() {
  const navigate = useNavigate();
  const handlePostJobClick = () => {
    navigate("/post-job");
  };

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
      body: "Find the right candidate for your freelance project. See hundreds of thousands of available web developer freelancers.",
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
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
    role: "",
  });
  const getUserData = async () => {
    try {
      const res = await axios.get(
        "https://g3-job-lk.onrender.com/getUserData",
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      const userData = {
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: res.data.user.profile_image,
        email: res.data.user.email,
        role: res.data.user.user_role,
      };
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const [jobs, setJobs] = useState([]);
  const getJobData = async () => {
    try {
      const res = await axios.get("https://g3-job-lk.onrender.com/getJobData", {
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
    if (jobs.length >= 3) {
      return [...jobs].reverse().slice(0, 3);
    } else {
      return [...jobs].reverse();
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

          {/* Main Content Column */}
          <Col md={9} className="py-3">
            <div className="row d-flex align-items-center">
              <div className="col-md-10">
                <h2 className="heading">Welcome, {userData.name}</h2>
              </div>
              <div className="col">
                <button className="button-custom" onClick={handlePostJobClick}>
                  Post a Job
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-9">
                <div className="input-group mb-3 rounded">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Browse freelancers that are tailored to you"
                    aria-label="Browse freelancers"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    id="button-addon2"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="row">
              {infoCards.map((card, index) => (
                <div key={index} className="col-md-4 mb-4 pe-3">
                  <div className="card custom-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className={card.icon}></i>
                        {card.title}
                      </h5>
                      <p className="card-text">{card.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Row>
              <h2 className="heading">Your Current Jobs and Recommendations</h2>
            </Row>
            <div className="row">
              <h4 className="sub-heading">Your Latest Job Posts</h4>
              {getJobsForDisplay().map((job, index) => (
                <JobCard key={index} job={job} userRole={userData.role} />
              ))}
            </div>

            <Row>
              <h4 className="sub-heading">Recommended Freelancers</h4>
            </Row>

            <Row>
              <h2 className="heading">Most Popular Freelance Categories</h2>
            </Row>
            <Row>
              <ServiceCarousel serviceGroups={serviceGroups} />
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default EmployerHome;
