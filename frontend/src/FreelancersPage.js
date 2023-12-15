import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

function FreelancersPage() {
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

  //get freelancers data
  const [freelancersData, setFreelancersData] = useState([]);
  const getFreelancersData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getFreelancersData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Freelancers Data:" + JSON.stringify(res.data, null, 2));
      setFreelancersData(res.data);
    } catch (error) {
      console.error("Error fetching freelancers data:", error);
    }
  };

  useEffect(() => {
    getUserData();
    getFreelancersData();
  }, []);
  return (
    <>
      <Header userData={userData} />
      <div>
        <div className="row">
          <div className="col-md-3">
            <Sidebar userData={userData} />
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-9">
                <div className="input-group mb-3 rounded">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Browse freelancers"
                    aria-label="Browse freelancers"
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

            <div className="row">
              <div className="col-md-12">
                <h2 className="heading">Available Freelancers</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FreelancersPage;
