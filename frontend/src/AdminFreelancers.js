import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./styles/FreelancerHomeStyle.css";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FreelancerTable from "./components/FreelancerTable";

function AdminFreelancers() {
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    email: "",
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
      setUserData({
        name: res.data.user.first_name + " " + res.data.user.last_name,
        profileImage: res.data.user.profile_image,
        email: res.data.user.email,
        role: res.data.user.user_role,
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
            <Col className="align-items-center justify-content-center mb-4">
              <Row>
                <Col md={10} className="d-flex align-items-center">
                  <h2 className="heading">Available Freelancers</h2>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex align-items-center">
                  <FreelancerTable />
                </Col>
              </Row>
            </Col>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default AdminFreelancers;
