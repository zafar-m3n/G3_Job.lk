import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import "./styles/FreelancersPage.css";

function Resources() {
  const [userData, setUserData] = useState({
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

  //resources
  const [resources, setResources] = useState([]);

  const getResources = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getResources", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Resources:" + JSON.stringify(res.data, null, 2));
      setResources(res.data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };
  useEffect(() => {
    getUserData();
    getResources();
  }, []);
  return (
    <>
      <Header userData={userData} />
      <Container fluid>
        <div className="row">
          <Col
            md={3}
            className="p-0"
            style={{
              backgroundColor: "#0B2447",
            }}
          >
            <Sidebar />
          </Col>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-9">
                <div className="input-group mb-3 rounded">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Browse resources"
                    aria-label="Browse resources"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Resources;
