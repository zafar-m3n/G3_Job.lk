import React, { useEffect, useState } from "react";
import "./styles/EmployerHomeStyle.css";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
    role: "",
    location: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalUserData, setOriginalUserData] = useState({ ...userData });
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleEditMode = () => {
    if (!isEditMode) {
      setOriginalUserData({ ...userData });
    }
    setIsEditMode(!isEditMode);
  };

  const [isEditDescription, setIsEditDescription] = useState(false);
  const [isEditLanguages, setIsEditLanguages] = useState(false);
  const [isEditWebsite, setIsEditWebsite] = useState(false);
  const [tempDescription, setTempDescription] = useState("");
  const [tempLanguages, setTempLanguages] = useState("");
  const [tempWebsite, setTempWebsite] = useState("");

  const toggleEditDescription = () => {
    setTempDescription(userData.description);
    setIsEditDescription(!isEditDescription);
  };

  const toggleEditLanguages = () => {
    setTempLanguages(userData.languages);
    setIsEditLanguages(!isEditLanguages);
  };

  const toggleEditWebsite = () => {
    setTempWebsite(userData.website);
    setIsEditWebsite(!isEditWebsite);
  };

  // Handle Change Functions
  const handleDescriptionChange = (e) => {
    setTempDescription(e.target.value);
  };

  const handleLanguagesChange = (e) => {
    setTempLanguages(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setTempWebsite(e.target.value);
  };

  // Save Functions
  const saveDescription = () => {
    setUserData({ ...userData, description: tempDescription });
    setIsEditDescription(false);
  };

  const saveLanguages = () => {
    setUserData({ ...userData, languages: tempLanguages });
    setIsEditLanguages(false);
  };

  const saveWebsite = () => {
    setUserData({ ...userData, website: tempWebsite });
    setIsEditWebsite(false);
  };

  const getUserData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getUserData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log(res.data.user);
      setUserData({
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: res.data.user.profile_image,
        email: res.data.user.email,
        location: res.data.user.district,
        role: res.data.user.user_role,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:8081/uploadProfileImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      const imageUrl = response.data.imageUrl.replace(/\\/g, "/");
      console.log("Modified URL:", imageUrl);

      return imageUrl; // Return the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };

  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Kurunegala",
    "Puttalam",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Moneragala",
    "Ratnapura",
    "Kegalle",
  ];

  const saveChanges = async () => {
    if (selectedImage) {
      console.log(selectedImage);
      let imageUrl = await uploadImage();
      if (imageUrl) {
        imageUrl = `../backend/${imageUrl}`;
        console.log("Image URL:", imageUrl);
        setUserData({ ...userData, profileImage: imageUrl });
        console.log("New Image URL:", userData.profileImage);
      }
    } else {
      console.log("No image selected");
    }
    try {
      const response = await axios.post(
        "http://localhost:8081/updateUserData",
        userData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Response:", response);

      setIsEditMode(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error saving data:", error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };

  const cancelEdit = () => {
    setUserData({ ...originalUserData });
    setIsEditMode(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  return (
    <>
      <Navbar className="w-100">
        <Container fluid>
          {/* Logo */}
          <Navbar.Brand href="/" className="fs-3 logo-font">
            Job.lk
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navigation and Action Buttons */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center"
          >
            {/* Navigation Links */}
            <Nav>
              <Nav.Link href="/employer-dashboard">Home</Nav.Link>
              <Nav.Link href="#jobs">Jobs</Nav.Link>
              <Nav.Link href="#freelancers">Freelancers</Nav.Link>
              <Nav.Link href="#how-it-works">How it works?</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {/* Action Buttons */}
          <Nav>
            {/* Display User Name and Profile Image if available */}
            {userData.name && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    marginRight: "5px",
                  }}
                >
                  {userData.name}
                </span>
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col
            md={3}
            className="p-0 h-100 d-flex flex-column align-self-stretch"
          >
            <Sidebar />
          </Col>

          {/* Main Content Column */}
          <Col md={9} className="py-3">
            <Container fluid>
              <Row className="justify-content-between mb-5">
                {/* Top Left Container */}
                <Col
                  md={4}
                  style={{
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <div className="profile-container d-flex flex-column justify-content-center align-items-center">
                    {isEditMode ? (
                      <div className="profile-container d-flex flex-column justify-content-center align-items-center">
                        <img
                          src={userData.profileImage}
                          alt="Profile"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    ) : (
                      <img
                        src={userData.profileImage}
                        alt="Profile"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                    <h3 className="text-center">{userData.name}</h3>
                    <p>Role: {toTitleCase(userData.role)}</p>
                    {!isEditMode && (
                      <Button
                        variant="outline-primary"
                        className="mb-3"
                        onClick={toggleEditMode}
                      >
                        Edit Profile
                      </Button>
                    )}

                    {isEditMode && (
                      <div className="d-flex justify-content-around p-2">
                        <Button
                          variant="outline-danger"
                          className="mx-2 my-0"
                          onClick={cancelEdit}
                        >
                          Cancel Edit
                        </Button>
                        <Button
                          variant="outline-success"
                          className="mx-2 my-0"
                          onClick={saveChanges}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}

                    {isEditMode ? (
                      <Form.Control
                        as="select"
                        value={userData.location}
                        onChange={(e) =>
                          setUserData({ ...userData, location: e.target.value })
                        }
                      >
                        {districts.map((district, index) => (
                          <option key={index} value={district}>
                            {district}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      <p>Location: {userData.location}</p>
                    )}
                  </div>
                </Col>

                {/* Top Right Container */}
                <Col
                  md={7}
                  style={{
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  }}
                  className="d-flex flex-column align-items-center justify-content-center"
                >
                  <img
                    src="/images/freelancer-icon.jpg"
                    alt="Freelancer Icon"
                    className="mb-4"
                    style={{ width: "200px" }}
                  />
                  <button className="button-custom">Become a freelancer</button>
                </Col>
              </Row>

              <Row className="justify-content-between mb-5">
                {/* Bottom Left Container */}
                <Col
                  md={4}
                  style={{
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  }}
                  className="p-3"
                >
                  <div className="content-placeholder">
                    {/* Description Section */}
                    <div className="mb-3">
                      <h5>Description</h5>
                      {isEditDescription ? (
                        <>
                          <input
                            value={tempDescription}
                            onChange={handleDescriptionChange}
                            className="form-control mb-2"
                          />
                          <button
                            className="btn btn-primary"
                            onClick={saveDescription}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <p>
                            {userData.description || "No description available"}
                          </p>
                          <a
                            className="text-primary text-decoration-none"
                            onClick={toggleEditDescription}
                          >
                            Edit Description
                          </a>
                        </>
                      )}
                    </div>

                    {/* Languages Section */}
                    <div className="mb-3">
                      <h5>Languages</h5>
                      {isEditLanguages ? (
                        <>
                          <input
                            value={tempLanguages}
                            onChange={handleLanguagesChange}
                            className="form-control mb-2"
                          />
                          <button
                            className="btn btn-primary"
                            onClick={saveLanguages}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <p>{userData.languages || "No languages added"}</p>
                          <a
                            className="text-primary text-decoration-none"
                            onClick={toggleEditLanguages}
                          >
                            Edit Languages
                          </a>
                        </>
                      )}
                    </div>

                    {/* Website Section */}
                    <div className="mb-3">
                      <h5>Website</h5>
                      {isEditWebsite ? (
                        <>
                          <input
                            value={tempWebsite}
                            onChange={handleWebsiteChange}
                            className="form-control mb-2"
                          />
                          <button
                            className="btn btn-primary"
                            onClick={saveWebsite}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          {userData.website ? (
                            <a
                              href={userData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {userData.website}
                            </a>
                          ) : (
                            <p>No website added</p>
                          )}
                          <a
                            className="text-primary text-decoration-none"
                            onClick={toggleEditWebsite}
                          >
                            Edit Website
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>

      <Container fluid className="px-5 py-3 fifth-section">
        <Row className="bg-transparent">
          {/* First Column - Logo and About */}
          <Col md={5} className="mx-auto mb-3 bg-transparent">
            <Navbar.Brand href="/" className="fs-3 footer-logo bg-transparent">
              Job.lk
            </Navbar.Brand>
            <p className="footer-content">
              Job.lk is a specialized freelance platform tailored for web
              developer freelancers in Sri Lanka. Our platform serves as a
              dynamic marketplace, connecting talented web developers with a
              diverse range of opportunities. Whether you are a skilled web
              developer seeking exciting projects or an employer searching for
              top-notch web development expertise, Job.lk is your go-to
              destination. Discover the perfect match for your project or
              showcase your skills to a local and global audience, all on
              Job.lk, the premier choice for web development freelancers in Sri
              Lanka.
            </p>
          </Col>

          {/* Second Column - Quick Links */}
          <Col md={3} className="mx-auto mb-3 bg-transparent">
            <h5 className="footer-content">Quick Links</h5>
            <Nav className="footer-content">
              <Col className="footer-content">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="#jobs">Jobs</Nav.Link>
                <Nav.Link href="#freelancers">Freelancers</Nav.Link>
                <Nav.Link href="#how-it-works">How it works?</Nav.Link>
              </Col>
            </Nav>
          </Col>

          {/* Third Column - Contact / Subscription Form */}
          <Col md={3} className="mx-auto mb-3 bg-transparent">
            <h5 className="footer-content">Get in touch</h5>
            <Form className="footer-content">
              <Form.Group className="mb-3 rounded" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group className="mb-3 rounded" controlId="formBasicName">
                <Form.Control type="text" placeholder="Your Name" />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="custom-primary-btn"
              >
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        <h5 className="footer-content text-center">
          CCG3 All Rights Reserved.
        </h5>
      </Container>
    </>
  );
}

export default ProfilePage;
