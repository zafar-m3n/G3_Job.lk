import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployerTable = () => {
  const [employersData, setEmployersData] = useState([]);
  const getEmployersData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getEmployersData", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Employers Data:" + JSON.stringify(res, null, 2));
      setEmployersData(res.data.employers);
      console.log("Employers Data:" + JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.error("Error fetching employers data:", error);
    }
  };

  useEffect(() => {
    getEmployersData();
  }, []);

  return (
    <div className="table-responsive w-100">
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>District</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employersData.map((employer) => (
            <tr>
              <td>
                {employer.first_name} {employer.last_name}
              </td>
              <td>{employer.email}</td>
              <td>{employer.district}</td>
              <td>{employer.description}</td>
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

export default EmployerTable;
