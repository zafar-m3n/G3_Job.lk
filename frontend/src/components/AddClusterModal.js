import { useState } from "react";
import axios from "axios";
function AddClusterModal({ onClusterAdded }) {
  const [show, setShow] = useState(false);
  const [clusterData, setClusterData] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validateInputs = () => {
    const newErrors = {};
    if (!clusterData.name) newErrors.name = "Name is required";
    if (!clusterData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addCluster = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post(
        "https://g3-job-lk.onrender.com/addCluster",
        clusterData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setSuccessMessage("");
        setShow(false);
        onClusterAdded();
      }, 3000);
    } catch (error) {
      console.error("Error updating cluster:", error);
    }
  };

  return (
    <>
      <button className="btn btn-outline-primary mx-2" onClick={handleShow}>
        Add New Cluster
      </button>

      {show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog w-50">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Freelancer Cluster</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                <form>
                  <div
                    className={`mb-3 ${errors.name ? "has-validation" : ""}`}
                  >
                    <label htmlFor="name" className="form-label">
                      Cluster Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      id="name"
                      placeholder="Enter cluster name"
                      onChange={(e) => {
                        setClusterData({
                          ...clusterData,
                          name: e.target.value,
                        });
                      }}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <div
                    className={`mb-3 ${
                      errors.description ? "has-validation" : ""
                    }`}
                  >
                    <label htmlFor="description" className="form-label">
                      Cluster Description
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      id="description"
                      placeholder="Enter description"
                      onChange={(e) => {
                        setClusterData({
                          ...clusterData,
                          description: e.target.value,
                        });
                      }}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={addCluster}>
                  Add Freelancer Cluster
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddClusterModal;
