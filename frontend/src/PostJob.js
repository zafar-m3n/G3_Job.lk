import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/EmployerHomeStyle.css";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";

function PostJob() {
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
  });
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const values = {
    jobTitle,
    jobDescription,
    requiredSkills,
    estimatedBudget,
    projectDuration,
    experienceLevel,
    location,
    additionalInfo,
    employer: userData.email,
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!jobTitle) {
      formIsValid = false;
      errors["jobTitle"] = "*Please enter job title.";
    }

    if (!jobDescription) {
      formIsValid = false;
      errors["jobDescription"] = "*Please enter job description.";
    }

    if (!requiredSkills) {
      formIsValid = false;
      errors["requiredSkills"] = "*Please enter required skills.";
    }

    if (!estimatedBudget) {
      formIsValid = false;
      errors["estimatedBudget"] = "*Please enter estimated budget.";
    }

    if (!projectDuration) {
      formIsValid = false;
      errors["projectDuration"] = "*Please enter project duration.";
    }

    if (!experienceLevel) {
      formIsValid = false;
      errors["experienceLevel"] = "*Please select experience level.";
    }

    if (!location) {
      formIsValid = false;
      errors["location"] = "*Please select location.";
    }

    setErrors(errors);
    setShowSuccess(false);
    return formIsValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.post("https://g3-job-lk.onrender.com/postJob", values, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        });
        if (res.data.Status === "Success") {
          console.log(res.data);
          //timeout of 2 seconds
          setShowSuccess(true);
          setTimeout(() => {
            //navigate to employer dashboard
            navigate("/employer-dashboard");
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getUserData = async () => {
    try {
      const res = await axios.get("https://g3-job-lk.onrender.com/getUserData", {
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
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
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
            <h2 className="heading">Post a Job</h2>
            {showSuccess && (
              <div className="alert alert-success" role="alert">
                Job successfully posted!
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Job Title Field */}
              <div className="form-group row mb-3">
                <label htmlFor="jobTitle" className="col-sm-2 col-form-label">
                  Job Title
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.jobTitle ? "is-invalid" : ""
                    }`}
                    id="jobTitle"
                    placeholder="Enter job title"
                    value={jobTitle}
                    onChange={(e) => handleInputChange(e, setJobTitle)}
                  />
                  {errors.jobTitle && (
                    <div className="text-danger">{errors.jobTitle}</div>
                  )}
                </div>
              </div>

              {/* Job Description Field */}
              <div className="form-group row mb-3">
                <label
                  htmlFor="jobDescription"
                  className="col-sm-2 col-form-label"
                >
                  Job Description
                </label>
                <div className="col-sm-10">
                  <textarea
                    className={`form-control ${
                      errors.jobDescription ? "is-invalid" : ""
                    }`}
                    id="jobDescription"
                    rows="3"
                    placeholder="Describe the job"
                    value={jobDescription}
                    onChange={(e) => handleInputChange(e, setJobDescription)}
                  ></textarea>
                  {errors.jobDescription && (
                    <div className="text-danger">{errors.jobDescription}</div>
                  )}
                </div>
              </div>

              {/* Required Skills Field */}
              <div className="form-group row mb-3">
                <label
                  htmlFor="requiredSkills"
                  className="col-sm-2 col-form-label"
                >
                  Required Skills
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.requiredSkills ? "is-invalid" : ""
                    }`}
                    id="requiredSkills"
                    placeholder="HTML, CSS, JavaScript, etc."
                    value={requiredSkills}
                    onChange={(e) => handleInputChange(e, setRequiredSkills)}
                  />
                  {errors.requiredSkills && (
                    <div className="text-danger">{errors.requiredSkills}</div>
                  )}
                </div>
              </div>

              {/* Estimated Budget Field */}
              <div className="form-group row mb-3">
                <label
                  htmlFor="estimatedBudget"
                  className="col-sm-2 col-form-label"
                >
                  Estimated Budget (LKR)
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className={`form-control ${
                      errors.estimatedBudget ? "is-invalid" : ""
                    }`}
                    id="estimatedBudget"
                    placeholder="Enter estimated budget"
                    value={estimatedBudget}
                    onChange={(e) => handleInputChange(e, setEstimatedBudget)}
                  />
                  {errors.estimatedBudget && (
                    <div className="text-danger">{errors.estimatedBudget}</div>
                  )}
                </div>
              </div>

              {/* Project Duration Field */}
              <div className="form-group row mb-3">
                <label
                  htmlFor="projectDuration"
                  className="col-sm-2 col-form-label"
                >
                  Project Duration
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.projectDuration ? "is-invalid" : ""
                    }`}
                    id="projectDuration"
                    placeholder="Enter project duration"
                    value={projectDuration}
                    onChange={(e) => handleInputChange(e, setProjectDuration)}
                  />
                  {errors.projectDuration && (
                    <div className="text-danger">{errors.projectDuration}</div>
                  )}
                </div>
              </div>

              {/* Experience Level Field */}
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">
                  Experience Level
                </label>
                <div className="col-10">
                  <div className="row">
                    <div className="col-2">
                      <input
                        type="radio"
                        name="experienceLevel"
                        id="experienceLevel-Beginner"
                        value="Beginner"
                        checked={experienceLevel === "Beginner"}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      />
                      <label htmlFor="experienceLevel-Beginner">Beginner</label>
                    </div>
                    <div className="col-2">
                      <input
                        type="radio"
                        name="experienceLevel"
                        id="experienceLevel-Intermediate"
                        value="Intermediate"
                        checked={experienceLevel === "Intermediate"}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      />
                      <label htmlFor="experienceLevel-Intermediate">
                        Intermediate
                      </label>
                    </div>
                    <div className="col-2">
                      <input
                        type="radio"
                        name="experienceLevel"
                        id="experienceLevel-Expert"
                        value="Expert"
                        checked={experienceLevel === "Expert"}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      />
                      <label htmlFor="experienceLevel-Expert">Expert</label>
                    </div>
                    {errors.experienceLevel && (
                      <div className="text-danger">
                        {errors.experienceLevel}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Field */}
              <div className="form-group row mb-3">
                <label htmlFor="location" className="col-sm-2 col-form-label">
                  Location
                </label>
                <div className="col-sm-10">
                  <select
                    className={`form-control ${
                      errors.location ? "is-invalid" : ""
                    }`}
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select your district</option>
                    <option value="Ampara">Ampara</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Galle">Galle</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Hambantota">Hambantota</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Kegalle">Kegalle</option>
                    <option value="Kilinochchi">Kilinochchi</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Mannar">Mannar</option>
                    <option value="Matale">Matale</option>
                    <option value="Matara">Matara</option>
                    <option value="Monaragala">Monaragala</option>
                    <option value="Mullaitivu">Mullaitivu</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                    <option value="Puttalam">Puttalam</option>
                    <option value="Ratnapura">Ratnapura</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Vavuniya">Vavuniya</option>
                  </select>
                  {errors.location && (
                    <div className="text-danger">{errors.location}</div>
                  )}
                </div>
              </div>

              {/* Additional Information Field */}
              <div className="form-group row mb-3">
                <label
                  htmlFor="additionalInfo"
                  className="col-sm-2 col-form-label"
                >
                  Additional Information (Optional)
                </label>
                <div className="col-sm-10">
                  <textarea
                    className="form-control"
                    id="additionalInfo"
                    rows="3"
                    placeholder="Any additional information"
                    value={additionalInfo}
                    onChange={(e) => handleInputChange(e, setAdditionalInfo)}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="row">
                <div className="col-sm-10 offset-sm-2">
                  <button type="submit" className="button-custom">
                    Post Job
                  </button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default PostJob;
