import React, { useState, useEffect } from "react";
import axios from "axios";
import RemoveFreelancerModal from "../components/RemoveFreelancerModal";

const FreelancersTable = () => {
  const [freelancersData, setFreelancersData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const getFreelancersData = async () => {
    try {
      const res = await axios.get("https://g3-job-lk.onrender.com/getFreelancersData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Freelancers Data:" + JSON.stringify(res.data, null, 2));
      setFreelancersData(res.data.freelancers);
      console.log("Freelancers Data:" + JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.error("Error fetching freelancers data:", error);
    }
  };

  useEffect(() => {
    getFreelancersData();
  }, []);

  return (
    <div className="table-responsive w-100">
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>District</th>
            <th>Skills</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {freelancersData.map((freelancer) => (
            <tr>
              <td>
                {freelancer.first_name} {freelancer.last_name}
              </td>
              <td>{freelancer.email}</td>
              <td>{freelancer.district}</td>
              <td>{freelancer.skills}</td>
              <td>
                <a
                  href={`/freelancer/${freelancer.id}`}
                  className="btn btn-outline-primary"
                >
                  View
                </a>
                {/* <RemoveFreelancerModal /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FreelancersTable;
