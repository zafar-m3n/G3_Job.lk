import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row } from "react-bootstrap";

function FreelancerDetails({ userData }) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  // const [isEditingExperienceLevel, setIsEditingExperienceLevel] =
  //   useState(false);

  const [freelancerData, setFreelancerData] = useState({
    profileID: "",
    userID: "",
    description: "No description added",
    languages: "No languages added",
    skills: "No skills added",
    portfolioWebsite: "No portfolio website added",
    experienceLevel: "",
  });

  const getFreelancersData = async () => {
    try {
      const res = await axios.get(
        "https://g3-job-lk.onrender.com/getFreelancerData",
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      if (res.data.freelancer) {
        setFreelancerData({
          profileID: res.data.freelancer[0].profileID,
          userID: res.data.freelancer[0].userID,
          description: res.data.freelancer[0].description,
          languages: res.data.freelancer[0].languages,
          skills: res.data.freelancer[0].skills,
          experienceLevel: res.data.freelancer[0].experienceLevel,
          portfolioWebsite: res.data.freelancer[0].portfolioWebsite,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveDescription = async () => {
    const updatedFreelancerData = { ...freelancerData, userID: userData.id };
    setFreelancerData(updatedFreelancerData);
    try {
      const res = await axios.post(
        "https://g3-job-lk.onrender.com/updateFreelancerDescription",
        updatedFreelancerData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      if (res.data.Status === "Success") {
        setIsEditingDescription(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveLanguages = async () => {
    const updatedFreelancerData = { ...freelancerData, userID: userData.id };
    setFreelancerData(updatedFreelancerData);
    try {
      const res = await axios.post(
        "https://g3-job-lk.onrender.com/updateFreelancerLanguages",
        updatedFreelancerData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      if (res.data.Status === "Success") {
        setIsEditingLanguages(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveSkills = async () => {
    const updatedFreelancerData = { ...freelancerData, userID: userData.id };
    setFreelancerData(updatedFreelancerData);
    try {
      const res = await axios.post(
        "https://g3-job-lk.onrender.com/updateFreelancerSkills",
        updatedFreelancerData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      if (res.data.Status === "Success") {
        setIsEditingSkills(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveWebsite = async () => {
    const updatedFreelancerData = { ...freelancerData, userID: userData.id };
    setFreelancerData(updatedFreelancerData);
    try {
      const res = await axios.post(
        "https://g3-job-lk.onrender.com/updateFreelancerWebsite",
        updatedFreelancerData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      if (res.data.Status === "Success") {
        setIsEditingWebsite(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFreelancersData();
  }, []);
  return (
    <>
      <Row className="justify-content-between mb-3">
        <div className="col-md-4 profile-col">
          <div className="d-flex justify-content-between">
            <h4>Description</h4>
            <button
              onClick={() =>
                isEditingDescription
                  ? saveDescription()
                  : setIsEditingDescription(true)
              }
              className="btn text-primary"
            >
              {isEditingDescription ? "Save" : "Edit"}
            </button>
          </div>
          <div>
            {isEditingDescription ? (
              <input
                type="text"
                className="form-control my-2"
                value={freelancerData.description}
                onChange={(e) =>
                  setFreelancerData({
                    ...freelancerData,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              <p>{freelancerData.description}</p>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <h4>Languages</h4>
            <button
              onClick={() =>
                isEditingLanguages
                  ? saveLanguages()
                  : setIsEditingLanguages(true)
              }
              className="btn text-primary"
            >
              {isEditingLanguages ? "Save" : "Edit"}
            </button>
          </div>
          <div>
            {isEditingLanguages ? (
              <input
                type="text"
                className="form-control my-2"
                value={freelancerData.languages}
                onChange={(e) =>
                  setFreelancerData({
                    ...freelancerData,
                    languages: e.target.value,
                  })
                }
              />
            ) : (
              <p>{freelancerData.languages}</p>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <h4>Skills</h4>
            <button
              onClick={() =>
                isEditingSkills ? saveSkills() : setIsEditingSkills(true)
              }
              className="btn text-primary"
            >
              {isEditingSkills ? "Save" : "Edit"}
            </button>
          </div>
          <div>
            {isEditingSkills ? (
              <input
                type="text"
                className="form-control my-2"
                value={freelancerData.skills}
                onChange={(e) =>
                  setFreelancerData({
                    ...freelancerData,
                    skills: e.target.value,
                  })
                }
              />
            ) : (
              <p>{freelancerData.skills}</p>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <h4>Portfolio Website</h4>
            <button
              onClick={() =>
                isEditingWebsite ? saveWebsite() : setIsEditingWebsite(true)
              }
              className="btn text-primary"
            >
              {isEditingWebsite ? "Save" : "Edit"}
            </button>
          </div>
          <div>
            {isEditingWebsite ? (
              <input
                type="text"
                className="form-control my-2"
                value={freelancerData.portfolioWebsite}
                onChange={(e) =>
                  setFreelancerData({
                    ...freelancerData,
                    portfolioWebsite: e.target.value,
                  })
                }
              />
            ) : (
              <p>{freelancerData.portfolioWebsite}</p>
            )}
          </div>
          <h4>Experience Level</h4>
          <p>{freelancerData.experienceLevel}</p>
        </div>
        <div className="freelancer-col">
          <img src="/images/bid-icon.jpg" alt="Job Icon" className="bid-icon" />
          <button className="button-custom">Bid for Job</button>
        </div>
      </Row>
    </>
  );
}

export default FreelancerDetails;
