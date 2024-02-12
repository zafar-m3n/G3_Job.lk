import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import "./styles/FreelancersPage.css";
import ClusterTable from "./components/ClusterTable";

function FreelancerClusters() {
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
  const [clusterData, setClusterData] = useState([{}]);
  const getClusterData = async () => {
    try {
      let url = "http://localhost:8081/getClusters";
      console.log("User Role:" + userData.role);
      if (userData.role === "employer") {
        url = "http://localhost:8081/getClustersEmployer";
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });

      console.log("Cluster Data:" + JSON.stringify(res.data, null, 2));
      setClusterData(res.data.clusters);
    } catch (error) {
      console.error("Error fetching cluster data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getClusterData();
  }, [userData]);
  return (
    <>
      <Header userData={userData} />
      <div>
        <div className="row">
          <div className="col-md-3 sidebarbkg">
            <Sidebar userData={userData} />
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-12">
                <h2 className="heading">Available Freelancer Clusters</h2>
                {userData.role === "freelancer" && (
                  <p className="para">
                    Join a freelancer cluster to collaborate with skilled peers,
                    broaden your network, and access exclusive projects tailored
                    to your collective expertise and strengths.
                  </p>
                )}
                {userData.role === "employer" && (
                  <p className="para">
                    Hire a freelancer cluster to leverage a dynamic team of
                    experts, streamline project execution, and benefit from a
                    diverse range of skills and collaborative problem-solving
                    abilities.
                  </p>
                )}
              </div>
            </div>
            <div className="row">
              <ClusterTable clusters={clusterData} role={userData.role} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FreelancerClusters;
