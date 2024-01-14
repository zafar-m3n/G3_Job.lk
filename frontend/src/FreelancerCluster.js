import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import "./styles/FreelancersPage.css";

function FreelancerCluster() {
  const { clusterId } = useParams();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    profileImage: "",
    email: "",
    location: "",
    role: "",
  });
  const [clusterData, setClusterData] = useState([{}]);

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

  const getClusterData = async () => {
    try {
      console.log("Cluster ID:" + clusterId);
      const res = await axios.get(
        `http://localhost:8081/getClusterData/${clusterId}`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      console.log("Cluster Data:" + JSON.stringify(res.data.cluster, null, 2));
      setClusterData(res.data.cluster);
    } catch (error) {
      console.error("Error fetching cluster data:", error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString(); // Months are zero-based
    let year = date.getFullYear();

    // Add leading zero to day and month if they are single digit
    day = day.length < 2 ? "0" + day : day;
    month = month.length < 2 ? "0" + month : month;

    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getClusterData();
  }, [clusterId]);

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
              <div>
                <div className="row">
                  <div className="col-md-9">
                    <h2 className="heading">{clusterData[0].cluster_name}</h2>
                    <p>
                      <b>Members:</b> {clusterData.length} <br />
                      {clusterData[0].cluster_description}
                    </p>
                  </div>
                  <div className="col-md-3 d-flex align-items-center justify-content-end px-5">
                    {userData.role === "freelancer" && (
                      <button className="btn btn-outline-primary mx-1">
                        Join Cluster
                      </button>
                    )}
                    {userData.role === "employer" && (
                      <button className="btn btn-outline-primary mx-1">
                        Hire Cluster
                      </button>
                    )}
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>District</th>
                        <th>Date Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clusterData.map((cluster) => (
                        <tr key={cluster.id}>
                          <td>
                            {cluster.first_name + " " + cluster.last_name}
                          </td>
                          <td>{cluster.email}</td>
                          <td>{cluster.district}</td>
                          <td>{formatDate(cluster.joined_at)}</td>
                          <td>
                            <a
                              href={`/freelancer/${cluster.id}`}
                              className="btn btn-outline-primary"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FreelancerCluster;
