import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row } from "react-bootstrap";

function EmployerDetails({ userData }) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);

  const [employerData, setEmployerData] = useState({
    profileID: "",
    userID: userData.id,
    description: "No description added",
    languages: "No languages added",
    website: "No website added",
  });

  const getEmployersData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getEmployerData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Employer:", JSON.stringify(res.data.employer, null, 2));
      if (res.data.employer) {
        setEmployerData({
          profileID: res.data.employer[0].employerId,
          userID: res.data.employer[0].userId,
          description: res.data.employer[0].description,
          languages: res.data.employer[0].languages,
          website: res.data.employer[0].website,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveDescription = async () => {
    console.log("Employer Data:", JSON.stringify(employerData, null, 2));
    try {
      const res = await axios.post(
        "http://localhost:8081/updateEmployerDescription",
        employerData,
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
    console.log("Employer Data:", JSON.stringify(employerData, null, 2));
    try {
      const res = await axios.post(
        "http://localhost:8081/updateEmployerLanguages",
        employerData,
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

  const saveWebsite = async () => {
    console.log("Employer Data:", JSON.stringify(employerData, null, 2));
    try {
      const res = await axios.post(
        "http://localhost:8081/updateEmployerWebsite",
        employerData,
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
    getEmployersData();
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
                value={employerData.description}
                onChange={(e) =>
                  setEmployerData({
                    ...employerData,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              <p>{employerData.description}</p>
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
                value={employerData.languages}
                onChange={(e) =>
                  setEmployerData({
                    ...employerData,
                    languages: e.target.value,
                  })
                }
              />
            ) : (
              <p>{employerData.languages}</p>
            )}
          </div>

          <div className="d-flex justify-content-between">
            <h4>Website</h4>
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
                value={employerData.website}
                onChange={(e) =>
                  setEmployerData({
                    ...employerData,
                    website: e.target.value,
                  })
                }
              />
            ) : (
              <p>{employerData.website}</p>
            )}
          </div>
        </div>
        <div className="freelancer-col">
          <img src="/images/job-icon.jpg" alt="Job Icon" className="job-icon" />
          <button className="button-custom">Post a Job</button>
        </div>
      </Row>
    </>
  );
}

export default EmployerDetails;
