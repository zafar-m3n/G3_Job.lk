import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import FreelancerCard from "./components/FreelancerCard";
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
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <Header userData={userData} />
      <div>
        <div className="row">
          <div className="col-md-3 sidebarbkg">
            <Sidebar userData={userData} />
          </div>
          <div className="col-md-9"></div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Resources;
