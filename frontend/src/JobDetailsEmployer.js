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
    location: "",
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
        location: res.data.user.district,
        role: res.data.user.user_role,
      };
      console.log("User Data:" + JSON.stringify(res, null, 2));
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
      console.log("Job Data:" + JSON.stringify(res, null, 2));
      setJobs(res.data.Jobs);
    } catch (error) {
      console.log(error);
    }
  };
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  useEffect(() => {
    getUserData();
    getSingleJobData();
  }, []);

  return (
    <>
      <Header userData={userData} />
      <div className="container my-4">
        <div className="mb-4">
          <div className="row mb-2">
            <h2 className="mb-4 align-items-center description">
              {jobs.jobDescription}
            </h2>
            <div className="col-2 d-flex flex-column justify-content-center">
              <img
                src={userData.profileImage}
                alt="profile"
                className="rounded-circle image"
              />
            </div>
            <div className="col-7 d-flex flex-column justify-content-center">
              <p className="m-1 fs-5 ">{toTitleCase(userData.name)}</p>
              <p className="m-1 fs-5">{userData.location}</p>
              <button className="bg-info button-custom">Contact Us</button>
            </div>
            <div className="col-3">
              <div className="custom-job-details">
                <div className="card-header text-center">
                  <div className="card-title fw-bold mb-2">{jobs.jobTitle}</div>
                </div>
                <div className="card-body">
                  <p className="card-text text-secondary">
                    {" "}
                    Date Posted:{" "}
                    {new Date(jobs.datePosted).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="card-text bgt-clr">
                    <i class="fa-solid fa-dollar-sign bgt-clr"></i> Budget: LKR{" "}
                    {jobs.estimatedBudget}
                  </p>
                  <p className="card-text text-secondary">
                    <i class="fa-regular fa-clock text-secondary"></i> Duration:{" "}
                    {jobs.projectDuration}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-bottom-0">
              <strong>Experience Level:</strong> {jobs.experienceLevel}
            </li>
            <li className="list-group-item border-bottom">
              <strong>Additional Information:</strong> {jobs.additionalInfo}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="title">Bids for this Job</h3>
          <p>No bids yet.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JobDetailsEmployer;
