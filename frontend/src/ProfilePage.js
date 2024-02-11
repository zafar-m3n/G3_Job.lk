import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./styles/EmployerHomeStyle.css";
import "./styles/ProfilePageStyles.css";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import EmployerDetails from "./components/EmployerDetails";
import FreelancerDetails from "./components/FreelancerDetails";

function ProfilePage() {
  // const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
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

  const getUserData = async () => {
    try {
      const res = await axios.get("https://g3-job-lk.onrender.com/getUserData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log(res.data.user);
      setUserData({
        id: res.data.user.id,
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

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post(
        "https://g3-job-lk.onrender.com/uploadProfileImage",
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
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };

  const saveChanges = async () => {
    let updatedUserData = { ...userData };

    if (selectedImage) {
      console.log(selectedImage);
      let imageUrl = await uploadImage();
      if (imageUrl) {
        updatedUserData.profileImage = `https://g3-job-lk.onrender.com/images/${imageUrl}`;
        setUserData(updatedUserData);
      }
    } else {
      console.log("No image selected");
    }

    try {
      const response = await axios.post(
        "https://g3-job-lk.onrender.com/updateUserData",
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Response:", response);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const cancelEdit = () => {
    setUserData({ ...originalUserData });
    setIsEditMode(false);
  };

  const [verified, setVerified] = useState(true);
  useEffect(() => {
    const getVerification = async () => {
      try {
        const res = await axios.get(
          `https://g3-job-lk.onrender.com/getVerification/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("auth"))?.token
              }`,
            },
          }
        );
        console.log(res.data);
        if (res.data.awardedBidsCount >= 5) {
          setVerified(true);
        } else {
          setVerified(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getVerification();
  }, [userData.id]);

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
            <Container fluid>
              <Row className="justify-content-between mb-3">
                {/* Top Left Container */}
                <div className="col-md-4 profile-col">
                  <div className="profile-container">
                    {isEditMode ? (
                      <div className="profile-container">
                        <img
                          src={userData.profileImage}
                          alt="Profile"
                          className="profile-img"
                        />
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            id="inputGroupFile02"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={userData.profileImage}
                        alt="Profile"
                        className="profile-img"
                      />
                    )}

                    <h3 className="text-center d-flex">
                      {userData.name}
                      <p className="ms-2 text-muted text-capitalize">
                        {verified ? (
                          <i className="fas fa-check-circle me-2 text-primary"></i>
                        ) : (
                          <></>
                        )}
                      </p>
                    </h3>
                    <p>Role: {toTitleCase(userData.role)}</p>
                    {!isEditMode && (
                      <button
                        className="btn btn-outline-primary mb-3"
                        onClick={toggleEditMode}
                      >
                        Edit Profile
                      </button>
                    )}

                    {isEditMode && (
                      <div className="d-flex justify-content-around p-2">
                        <button
                          className="btn btn-outline-danger mx-2 my-0"
                          onClick={cancelEdit}
                        >
                          Cancel Edit
                        </button>
                        <button
                          className="btn btn-outline-success mx-2 my-0"
                          onClick={saveChanges}
                        >
                          Save Changes
                        </button>
                      </div>
                    )}

                    {isEditMode ? (
                      <select
                        className="form-control"
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
                      </select>
                    ) : (
                      <p>Location: {userData.location}</p>
                    )}
                  </div>
                </div>
                {/* Top Right Container */}
                <div className="freelancer-col">
                  <img
                    src="/images/freelancer-icon.jpg"
                    alt="Freelancer Icon"
                    className="freelancer-icon"
                  />
                  <button className="button-custom">Become a freelancer</button>
                </div>
              </Row>
              {userData.role === "employer" ? (
                <EmployerDetails userData={userData} />
              ) : (
                <FreelancerDetails userData={userData} />
              )}
            </Container>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default ProfilePage;
