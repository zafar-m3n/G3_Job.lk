import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import "./styles/FreelancersPage.css";

function Employer() {
  const { employerId } = useParams();
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
      const res = await axios.get("http://localhost:8081/getUserData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      const userData = {
        id: res.data.user.id,
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: res.data.user.profile_image,
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

  //get individual employer data
  const [employerData, setEmployerData] = useState({});
  const getEmployerData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/getSingleEmployerData/${employerId}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Employer Data:" + JSON.stringify(res.data, null, 2));
      setEmployerData(res.data.employer);
    } catch (error) {
      console.error("Error fetching employer data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getEmployerData();
  }, [employerId]);

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
                  src={employerData.profile_image}
                  alt="Profile"
                  className="img-fluid rounded-circle mb-3 w-50"
                />
                <h3>
                  {employerData.first_name} {employerData.last_name}
                </h3>
              </div>
              <div className="col-md-8">
                <h4>About</h4>
                <p>{employerData.description || "No description added"}</p>
                <hr />
                <h4>Languages</h4>
                <p>{employerData.languages || "Not specified"}</p>
                <hr />
                <h4>Contact</h4>
                <p>Email: {employerData.email}</p>
                <p>Location: {employerData.district}</p>
                <p>
                  Website:{" "}
                  <a
                    href={employerData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {employerData.website}
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

export default Employer;
