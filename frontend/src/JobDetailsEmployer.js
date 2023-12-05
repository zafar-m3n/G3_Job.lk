import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/JobDetailsStyle.css";

function JobDetailsEmployer() {
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
    } catch (error) {
      console.log(error);
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
              <img
                src={userData.profileImage}
                alt="profile"
                className="img-fluid rounded-circle image"
              />
            </div>
            <div className="col">
              <h2 className="m-0 description">{jobs.jobDescription}</h2>
              <p className="m-0">{jobs.jobTitle}</p>
            </div>
          </div>
          <ul className="list-unstyled">
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

        <div>
          <h3>Bids for this Job</h3>
          <p>No bids yet.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JobDetailsEmployer;
