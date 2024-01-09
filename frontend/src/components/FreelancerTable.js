import React, { useState, useEffect } from "react";
import axios from "axios";

const FreelancersTable = () => {
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
                {/* Place action buttons or links here */}
                <button className="btn btn-outline-primary mx-2">View</button>
                <button className="btn btn-outline-danger mx-2">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FreelancersTable;
