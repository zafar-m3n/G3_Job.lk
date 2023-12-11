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
      response.data.Employer[0].profile_image = `../${response.data.Employer[0].profile_image}`;
      console.log("Employer Data:" + JSON.stringify(response, null, 2));
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
          <div className="row mb-2">
            <h2 className="mb-4 align-items-center description">
              {jobs.jobDescription}
            </h2>
            <div className="col-2">
              <img
                src={employerData.profile_image}
                alt="profile"
                className="rounded-circle image"
              />
            </div>
            <div className="col-7 d-flex flex-column justify-content-center">
              <p className="m-1 fs-5 ">
                {employerData.first_name} {employerData.last_name}
              </p>
              <p className="m-1 fs-5">{employerData.district}</p>
              <button className="bg-info button-custom">Contact Us</button>
            </div>
            <div className="col-3">
              <div className="custom-job-details">
                <div className="card-body">
                  <p className="card-text text-secondary">
                    Job Title: {jobs.jobTitle}
                  </p>
                  <p className="card-text bgt-clr">
                    <i class="fa-solid fa-dollar-sign bgt-clr"></i> Budget: LKR{" "}
                    {jobs.estimatedBudget}
                  </p>
                  <p className="card-text text-secondary">
                    <i class="fa-regular fa-clock text-secondary"></i> Duration:{" "}
                    {jobs.projectDuration}
                  </p>
                  <div className="d-flex justify-content-center">
                    <button className="button-custom">Bid for this Job</button>
                  </div>
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
          <h3 className="title">More Jobs From This Employer</h3>
          <p>Not done yet.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JobDetailsFreelancer;
