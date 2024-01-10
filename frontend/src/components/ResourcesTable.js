import React, { useState, useEffect } from "react";
import axios from "axios";

const ResourcesTable = () => {
  const [resourcesData, setResourcesData] = useState([]);
  const getResourcesData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/getResources", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.token
          }`,
        },
      });
      console.log("Resources Data:" + JSON.stringify(res.data, null, 2));
      setResourcesData(res.data.resources);
      console.log("Resources Data:" + JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.error("Error fetching resources data:", error);
    }
  };

  useEffect(() => {
    getResourcesData();
  }, []);

  return (
    <div className="table-responsive w-100">
      <table className="table table-striped align-middle w-100">
        <thead>
          <tr>
            <th className="col-3">Title</th>
            <th className="col-2">Category</th>
            <th className="col-4">Description</th>
            <th className="col-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resourcesData.map((resource) => (
            <tr key={resource.id}>
              <td className="col-3">{resource.title}</td>
              <td className="col-2">{resource.category}</td>
              <td className="col-4">{resource.description}</td>
              <td className="col-3">
                <button className="btn btn-outline-primary mx-1">Edit</button>
                <button className="btn btn-outline-danger mx-1">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesTable;
