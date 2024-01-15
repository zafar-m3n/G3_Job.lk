import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import "./styles/FreelancersPage.css";
import RatingModal from "./components/RatingModal";

function Freelancer() {
  const { freelancerId } = useParams();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    profileImage: "",
    email: "",
    location: "",
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
        id: res.data.user.id,
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

  //get individual freelancer data
  const [freelancerData, setFreelancerData] = useState({});
  const getFreelancerData = async () => {
    try {
      const res = await axios.get(
        `https://g3-job-lk.onrender.com/getFreelancerData/${freelancerId}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Freelancer Data:" + JSON.stringify(res.data, null, 2));
      setFreelancerData(res.data.freelancer);
    } catch (error) {
      console.error("Error fetching freelancer data:", error);
    }
  };

  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isEndorsed, setIsEndorsed] = useState(false);

  const endorseSkills = async () => {
    try {
      console.log("clicked endorse button");
      await axios.post(
        "https://g3-job-lk.onrender.com/endorseSkills",
        {
          endorserId: userData.id,
          freelancerId,
          skills: freelancerData.skills,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      setIsEndorsed(true);
    } catch (error) {
      console.error("Error endorsing skills:", error);
    }
  };

  // const getEndorsement = async () => {
  //   try {
  //     const res = await axios.get(
  //       `https://g3-job-lk.onrender.com/getEndorsement/${freelancerId}/${userData.id}`
  //     );
  //     console.log("Endorsement Data:" + JSON.stringify(res.data, null, 2));
  //     setIsEndorsed(res.data.isEndorsed);
  //   } catch (error) {
  //     console.error("Error fetching endorsement data:", error);
  //   }
  // };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getFreelancerData();
  }, [freelancerId]);

  // useEffect(() => {
  //   getEndorsement();
  // }, [isEndorsed, freelancerId]);

  useEffect(() => {
    if (ratingSubmitted) {
      getFreelancerData();
      setRatingSubmitted(false);
    }
  }, [ratingSubmitted, freelancerId]);

  return (
    <>
      <Header userData={userData} />
      <div className="row">
        <div className="col-md-3 sidebarbkg">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="container">
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={freelancerData.profile_image}
                  alt="Profile"
                  className="img-fluid rounded-circle mb-3 w-50"
                />
                <h3>
                  {freelancerData.first_name} {freelancerData.last_name}
                </h3>
                <p className="text-muted text-capitalize">
                  <i className="fas fa-star me-2 text-warning"></i>
                  {freelancerData.rating}/5 rating
                </p>
                <RatingModal
                  freelancerId={freelancerId}
                  employerId={userData.id}
                  onRatingSubmit={() => setRatingSubmitted(true)}
                />
              </div>
              <div className="col-md-8">
                <h4>About</h4>
                <p>{freelancerData.description || "No description added"}</p>
                <hr />
                <div className="row bg-warning">
                  <div className="col-6 d-flex align-items-center">
                    <h4 className="m-0">Skills</h4>
                  </div>
                  <div className="col-6 d-flex align-items-center justify-content-end">
                    <button
                      className={`btn ${
                        isEndorsed ? "btn-success" : "btn-secondary"
                      }`}
                      onClick={endorseSkills}
                      disabled={isEndorsed}
                    >
                      {isEndorsed ? "Endorsed" : "Endorse Skills"}
                    </button>
                  </div>
                </div>
                <p>{freelancerData.skills || "No skills added"}</p>
                <hr />
                <h4>Experience Level</h4>
                <p>{freelancerData.experienceLevel || "Not specified"}</p>
                <hr />
                <h4>Languages</h4>
                <p>{freelancerData.languages || "Not specified"}</p>
                <hr />
                <h4>Contact</h4>
                <p>Email: {freelancerData.email}</p>
                <p>Location: {freelancerData.district}</p>
                <p>
                  Portfolio:{" "}
                  <a
                    href={freelancerData.portfolioWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {freelancerData.portfolioWebsite}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Freelancer;
