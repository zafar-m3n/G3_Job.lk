import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Freelancer() {
  const { freelancerId } = useParams();
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

  //get individual freelancer data
  const [freelancerData, setFreelancerData] = useState({});
  const getFreelancerData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/getFreelancerData/${freelancerId}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Freelancer Data:" + JSON.stringify(res.data, null, 2));
      setFreelancerData(res.data);
    } catch (error) {
      console.error("Error fetching freelancer data:", error);
    }
  };

  useEffect(() => {
    getUserData();
    getFreelancerData();
  }, []);

  return (
    <>
      <Header userData={userData} />
      <Footer />
    </>
  );
}

export default Freelancer;
