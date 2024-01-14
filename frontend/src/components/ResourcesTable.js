import React, { useState } from "react";
import EditResourceModal from "../components/EditResourceModal";
import DeleteResourceModal from "../components/DeleteResourceModal";

const ResourcesTable = ({ resources, onResourcesChange }) => {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000); // Hide the message after 3 seconds
    onResourcesChange(); // Notify parent to refresh the resources list
  };

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
          {resources.map((resource) => (
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
