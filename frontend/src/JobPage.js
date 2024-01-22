import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  FormControl,
  Form,
  Accordion,
} from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import JobCard from "./components/JobCard";
import "./styles/EmployerHomeStyle.css";

function JobPage() {
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
    role: "",
  });
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [maxBudget, setMaxBudget] = useState(50000);

  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];

  const webDevSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Angular",
    "Node.js",
    "Python",
    "PHP",
    "Java",
    "TypeScript",
    "SQL",
    "MongoDB",
  ];

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

  const getJobData = async () => {
    if (userData.role === "employer") {
      try {
        const res = await axios.get("http://localhost:8081/getJobData", {
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
          "http://localhost:8081/getJobDataFreelancer",
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("auth"))?.token
              }`,
            },
          }
        );
        console.log(res.data.Jobs);
        setJobs(res.data.Jobs);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSkillChange = (event, skill) => {
    setSelectedSkills(
      event.target.checked
        ? [...selectedSkills, skill]
        : selectedSkills.filter((s) => s !== skill)
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const titleMatch = job.jobTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const descriptionMatch = job.jobDescription
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const priceMatch = job.estimatedBudget <= parseFloat(maxBudget);
    const locationMatch = filterLocation
      ? job.location === filterLocation
      : true;
    const skillsMatch =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) =>
        job.requiredSkills.toLowerCase().includes(skill.toLowerCase())
      );

    return (
      (titleMatch || descriptionMatch) &&
      priceMatch &&
      locationMatch &&
      skillsMatch
    );
  });

  const [recommendedJobs, setRecommendedJobs] = useState([]);

  const fetchRecommendedJobs = async () => {
    if (userData.role === "freelancer") {
      try {
        const response = await axios.get(
          `http://localhost:8081/recommendedJobs/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("auth"))?.token
              }`,
            },
          }
        );
        console.log("Response" + JSON.stringify(response.data, null, 2));
        setRecommendedJobs(response.data);
      } catch (error) {
        console.error("Error fetching recommended jobs: ", error);
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

  useEffect(() => {
    fetchRecommendedJobs();
  }, [userData]);

  return (
    <>
      <Header userData={userData} />
      <Container fluid>
        <Row>
          <Col md={3} className="p-0" style={{ backgroundColor: "#0B2447" }}>
            <Sidebar />
          </Col>
          <Col md={9}>
            <Row>
              <Col md={12}>
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <Col md={11}>
                        <FormControl
                          placeholder="Browse jobs"
                          aria-label="Browse jobs"
                          onChange={handleSearchChange}
                        />
                      </Col>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col md={3}>
                          <Form.Label>Price: Up to LKR {maxBudget}</Form.Label>
                          <Form.Range
                            min={0}
                            max={50000} // Example max value
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                          />
                        </Col>
                        <Col md={3}>
                          {/* Location Filter */}
                          <Form.Select
                            aria-label="Filter by location"
                            onChange={(e) => setFilterLocation(e.target.value)}
                          >
                            <option value="">Select a district</option>
                            {districts.map((district, index) => (
                              <option key={index} value={district}>
                                {district}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col md={6}>
                          {/* Skills Filter */}
                          <Row>
                            {webDevSkills.map((skill, index) => (
                              <Col md={4} key={index}>
                                <Form.Check
                                  type="checkbox"
                                  label={skill}
                                  onChange={(e) => handleSkillChange(e, skill)}
                                />
                              </Col>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
            {userData.role === "freelancer" &&
              recommendedJobs.length > 0 &&
              searchQuery === "" && (
                <Row>
                  <h2 className="heading">Recommended Jobs</h2>
                  {recommendedJobs.map((job, index) => (
                    <JobCard key={index} job={job} userRole={userData.role} />
                  ))}
                </Row>
              )}
            <Row>
              <h2 className="heading">
                {userData.role === "employer"
                  ? "Posted Jobs"
                  : "Browse Available Jobs"}
              </h2>
            </Row>
            <Row>
              {filteredJobs.map((job, index) => (
                <JobCard key={index} job={job} userRole={userData.role} />
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default JobPage;
