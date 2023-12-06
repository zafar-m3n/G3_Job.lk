import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/JobDetailsStyle.css";

function JobDetailsFreelancer() {
  const { jobId } = useParams();
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
      const userData = {
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: `../${res.data.user.profile_image}`,
        email: res.data.user.email,
        role: res.data.user.user_role,
      };
      console.log("User Data:" + JSON.stringify(userData, null, 2));
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const [jobs, setJobs] = useState([]);
  const [employerData, setEmployerData] = useState({});

  const getSingleJobData = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/getJobData/${jobId}`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      setJobs(res.data.Jobs);
      const employerEmail = res.data.Jobs.employerId;
      if (employerEmail) {
        await getEmployerData(employerEmail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployerData = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/getEmployerData/${email}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      setEmployerData(response.data.Employer[0]);
    } catch (error) {
      console.error("Error fetching employer data:", error);
    }
  };

  useEffect(() => {
    getUserData();
    getSingleJobData();
  }, []);

  return (
    <>
      <Header userData={userData} />
      <div className="container my-4">
        <div className="mb-4">
          <div className="row align-items-center mb-2">
            <div className="col-1">
              {employerData.profile_image === "images/profile.jpg" ? (
                <img
                  src={`../${employerData.profile_image}`}
                  alt="profile"
                  className="img-fluid rounded-circle image"
                />
              ) : (
                <img
                  src={employerData.profile_image}
                  alt="profile"
                  className="img-fluid rounded-circle image"
                />
              )}
            </div>
            <div className="col">
              <h2 className=" m-0 description">{jobs.jobDescription}</h2>
            </div>
          </div>
          <ul className="list-unstyled">
            <li>
              <strong>Employer: </strong> {employerData.first_name}{" "}
              {employerData.last_name}
            </li>
            <li>
              <strong>Job Title: </strong> {jobs.jobTitle}
            </li>
            <li>
              <strong>Skills Required:</strong> {jobs.requiredSkills}
            </li>
            <li>
              <strong>Budget:</strong> LKR {jobs.estimatedBudget}
            </li>
            <li>
              <strong>Duration:</strong> {jobs.projectDuration}
            </li>
            <li>
              <strong>Experience Level:</strong> {jobs.experienceLevel}
            </li>
            <li>
              <strong>Location:</strong> {jobs.location}
            </li>
            <li>
              <strong>Additional Information:</strong> {jobs.additionalInfo}
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JobDetailsFreelancer;
