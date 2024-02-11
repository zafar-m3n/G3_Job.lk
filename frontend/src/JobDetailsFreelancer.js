import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/JobDetailsStyle.css";

function JobDetailsFreelancer() {
  const { jobId } = useParams();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    profileImage: "",
    email: "",
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
        id: res.data.user.id,
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
      const res = await axios.get(`https://g3-job-lk.onrender.com/getJobData/${jobId}`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Job Data:" + JSON.stringify(res.data.Jobs, null, 2));
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
        `https://g3-job-lk.onrender.com/getEmployerData/${email}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      if (response.data.Employer[0].profile_image === "images/profile.jpg") {
        response.data.Employer[0].profile_image = `../${response.data.Employer[0].profile_image}`;
      }
      console.log(
        "Employer Data:" + JSON.stringify(response.data.Employer, null, 2)
      );
      setEmployerData(response.data.Employer[0]);
    } catch (error) {
      console.error("Error fetching employer data:", error);
    }
  };

  const [formErrors, setFormErrors] = useState({
    bidAmount: "",
    deadline: "",
    deliverables: "",
    additionalInfo: "",
    phoneNumber: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmitBid = async (event) => {
    event.preventDefault();
    const newErrors = {};

    // Extract values directly from the state or refs
    const bidAmount = document.getElementById("bidAmount").value;
    const deadline = document.getElementById("deadline").value;
    const deliverables = document.getElementById("deliverables").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    // Validate fields and set error messages
    if (!bidAmount) {
      newErrors.bidAmount = "Bid amount is required";
    }
    if (!deadline) {
      newErrors.deadline = "Deadline is required";
    }
    if (!deliverables) {
      newErrors.deliverables = "Deliverables are required";
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const bidDetails = {
      bidAmount: document.getElementById("bidAmount").value,
      deadline: document.getElementById("deadline").value,
      deliverables: document.getElementById("deliverables").value,
      additionalInfo: document.getElementById("additionalInfo").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      freelancerName: userData.name,
      freelancerEmail: userData.email,
      freelancerId: userData.id,
      employerName: `${employerData.first_name} ${employerData.last_name}`,
      employerEmail: employerData.email,
      employerId: employerData.id,
      jobId: jobs.id,
    };

    try {
      const response = await axios.post(
        "https://g3-job-lk.onrender.com/submitBid",
        bidDetails,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Bid Submitted Successfully: " + response.data);
      setShowModal(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
        getBidData();
      }, 3000);
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  const [bidData, setBidData] = useState([]);
  //getBidData
  const getBidData = async () => {
    try {
      const response = await axios.get(
        `https://g3-job-lk.onrender.com/getJobBids/${jobs.id}/${userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Bid Data:" + JSON.stringify(response.data, null, 2));
      setBidData(response.data.Bids[0]);
    } catch (error) {
      console.error("Error fetching bid data:", error);
    }
  };

  const hasAlreadyBid = bidData && bidData.jobId === jobs.id;
  console.log("hasAlreadyBid: " + hasAlreadyBid);

  useEffect(() => {
    getUserData();
    getSingleJobData();
  }, []);

  useEffect(() => {
    getBidData();
  }, [jobs, userData]);
  return (
    <>
      <Header userData={userData} />
      <div className="container my-4">
        <div className="mb-4">
          <div className="row mb-2">
            {showSuccessMessage && (
              <Alert
                variant="success"
                onClose={() => setShowSuccessMessage(false)}
                dismissible
              >
                Your bid has been successfully submitted!
              </Alert>
            )}
            <h2 className="mb-4 align-items-center description">
              {jobs.jobDescription}
            </h2>
            <div className="col-2 d-flex flex-column justify-content-center">
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
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="button-custom"
                      onClick={handleShow}
                    >
                      Bid for this Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Bid for Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form id="bidForm" onSubmit={handleSubmitBid}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="bidAmount">Bid Amount</Form.Label>
                  <Form.Control
                    type="number"
                    id="bidAmount"
                    isInvalid={!!formErrors.bidAmount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.bidAmount}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="deadline">Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    id="deadline"
                    isInvalid={!!formErrors.deadline}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.deadline}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="deliverables">Deliverables</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="deliverables"
                    isInvalid={!!formErrors.deliverables}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.deliverables}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="additionalInfo">
                    Additional Information
                  </Form.Label>
                  <Form.Control as="textarea" id="additionalInfo" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="phoneNumber">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    id="phoneNumber"
                    isInvalid={!!formErrors.phoneNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" form="bidForm">
                Submit Bid
              </Button>
            </Modal.Footer>
          </Modal>

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
          <h3 className="title">Your Latest Job Bid</h3>
          {hasAlreadyBid ? (
            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  {" "}
                  Bid Amount: LKR {bidData.bidAmount}
                </p>
                <p className="card-text"> Deadline: {bidData.deadline}</p>
                <p className="card-text">
                  {" "}
                  Deliverables: {bidData.deliverables}
                </p>
                <p className="card-text">
                  {" "}
                  Additional Information: {bidData.additionalInfo}
                </p>
                <p className="card-text">
                  {" "}
                  Phone Number: {bidData.phoneNumber}
                </p>
                <p className="card-text text-capitalize">
                  {" "}
                  Status: {bidData.status}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p>You have not bid for this job yet.</p>
            </div>
          )}
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
