import React, { useEffect } from "react";
import axios from "axios";

function FreelancerHome() {
  const getUserData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getUserData", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return <div>FreelancerHome</div>;
}

export default FreelancerHome;
