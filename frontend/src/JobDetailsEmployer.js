import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/JobDetailsStyle.css";

function JobDetailsEmployer() {
  const navigate = useNavigate();
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
      const res = await axios.get("https://g3-job-lk.onrender.com/getUserData", {
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
      console.log("User Data:" + JSON.stringify(res.data.user, null, 2));
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const [jobs, setJobs] = useState([]);
  const getSingleJobData = async () => {
    try {
      const res = await axios.get(`https://g3-job-lk.onrender.com/getJobData/${jobId}`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Job Data:" + JSON.stringify(res.data.Jobs, null, 2));
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

  const [bids, setBids] = useState([]);
  const getJobBids = async () => {
    try {
      const res = await axios.get(
        `https://g3-job-lk.onrender.com/getAllJobBids/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Job Bids:" + JSON.stringify(res.data.Bids, null, 2));
      setBids(res.data.Bids);
    } catch (error) {
      console.log(error);
    }
  };
  const hasBid = bids && bids.length > 0;
  console.log("Has Bid:" + hasBid);
  useEffect(() => {
    getUserData();
    getSingleJobData();
  }, []);

  const viewBid = (bidId) => {
    navigate(`/bid-details/${bidId}`);
  };

  useEffect(() => {
    getJobBids();
  }, [jobId]);

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
            </div>
            <div className="col-3">
              <div className="custom-job-details">
                <div className="card-header d-flex justify-content-between fw-bold">
                  <div className="card-title mb-2">{jobs.jobTitle}</div>
                  <p
                    className={`card-text text-capitalize ${
                      jobs.status === "open" ? "text-success" : "text-danger"
                    }`}
                  >
                    {jobs.status}
                  </p>
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
          {hasBid ? (
            bids.map((bid) => (
              <div className="card mb-3">
                <div className="row g-0 align-items-center">
                  <div className="col-md-1">
                    <div className="card-body">
                      {bid.profile_image === "images/profile.jpg" ? (
                        <img
                          src={`../${bid.profile_image}`}
                          alt="profile"
                          className="rounded-circle bid-image"
                        />
                      ) : (
                        <img
                          src={bid.profile_image}
                          alt="profile"
                          className="rounded-circle bid-image"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="card-body">
                      <h5 className="card-title">{bid.freelancerName}</h5>
                      <p className="card-text">
                        Bid Amount: LKR {bid.bidAmount}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card-body">
                      <p
                        className={`card-text text-capitalize fw-bold ${
                          bid.status === "awarded"
                            ? "text-success"
                            : bid.status === "pending"
                            ? "text-warning"
                            : "text-danger"
                        }
                      }`}
                      >
                        {bid.status}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card-body d-flex justify-content-end">
                      <button
                        className="btn btn-info text-white"
                        onClick={() => viewBid(bid.bidId)}
                      >
                        View Bid
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Bids Yet</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JobDetailsEmployer;
