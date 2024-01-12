import React, { useState, useEffect } from "react";
import axios from "axios";
import EditResourceModal from "../components/EditResourceModal";
import DeleteResourceModal from "../components/DeleteResourceModal";

const ResourcesTable = () => {
  const [resourcesData, setResourcesData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
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

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000); // Hide the message after 3 seconds
    getResourcesData();
  };

  useEffect(() => {
    getResourcesData();
  }, []);

  return (
    <div className="table-responsive w-100">
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

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
                <EditResourceModal
                  resource={resource}
                  onSuccess={handleSuccess}
                />
                <DeleteResourceModal
                  resource={resource}
                  onSuccess={handleSuccess}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesTable;
