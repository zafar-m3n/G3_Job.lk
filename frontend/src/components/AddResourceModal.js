import { useState } from "react";
import axios from "axios";
function AddResourceModal({ onResourceAdded }) {
  const [show, setShow] = useState(false);
  const [resourcesData, setResourcesData] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validateInputs = () => {
    const newErrors = {};
    if (!resourcesData.title) newErrors.title = "Title is required";
    if (!resourcesData.category) newErrors.category = "Category is required";
    if (!resourcesData.description)
      newErrors.description = "Description is required";
    if (!resourcesData.url) newErrors.url = "url is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const addResource = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/addResource",
        resourcesData,
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
        onResourceAdded();
      }, 3000);
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };
  return (
    <>
      <button className="btn btn-outline-primary mx-2" onClick={handleShow}>
        Add New Resource
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
                <h5 className="modal-title">Add Educational Resource</h5>
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
                    className={`mb-3 ${errors.title ? "has-validation" : ""}`}
                  >
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      id="title"
                      placeholder="Enter title"
                      onChange={(e) => {
                        setResourcesData({
                          ...resourcesData,
                          title: e.target.value,
                        });
                      }}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>
                  <div
                    className={`mb-3 ${
                      errors.category ? "has-validation" : ""
                    }`}
                  >
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.category ? "is-invalid" : ""
                      }`}
                      id="category"
                      placeholder="Enter category"
                      onChange={(e) => {
                        setResourcesData({
                          ...resourcesData,
                          category: e.target.value,
                        });
                      }}
                    />
                    {errors.category && (
                      <div className="invalid-feedback">{errors.category}</div>
                    )}
                  </div>
                  <div
                    className={`mb-3 ${
                      errors.description ? "has-validation" : ""
                    }`}
                  >
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      id="description"
                      placeholder="Enter description"
                      onChange={(e) => {
                        setResourcesData({
                          ...resourcesData,
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
                  <div className={`mb-3 ${errors.url ? "has-validation" : ""}`}>
                    <label htmlFor="url" className="form-label">
                      URL
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.url ? "is-invalid" : ""
                      }`}
                      id="url"
                      placeholder="Enter url"
                      onChange={(e) => {
                        setResourcesData({
                          ...resourcesData,
                          url: e.target.value,
                        });
                      }}
                    />
                    {errors.url && (
                      <div className="invalid-feedback">{errors.url}</div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={addResource}>
                  Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddResourceModal;
