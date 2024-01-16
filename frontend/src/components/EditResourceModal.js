import { useState } from "react";
import axios from "axios";
function EditResourceModal({ resource, onSuccess }) {
  const [show, setShow] = useState(false);
  const [resourcesData, setResourcesData] = useState(resource);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const saveResource = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/updateResource",
        resourcesData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      setShow(false);
      onSuccess(response.data);
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };
  return (
    <>
      <button className="btn btn-outline-primary mx-2" onClick={handleShow}>
        Edit
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
                <h5 className="modal-title">Edit Educational Resource</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={resourcesData.title}
                      onChange={(e) => {
                        setResourcesData({
                          ...resource,
                          title: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      value={resourcesData.category}
                      onChange={(e) => {
                        setResourcesData({
                          ...resource,
                          category: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      value={resourcesData.description}
                      onChange={(e) => {
                        setResourcesData({
                          ...resource,
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="link" className="form-label">
                      Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="link"
                      value={resourcesData.url}
                      onChange={(e) => {
                        setResourcesData({ ...resource, link: e.target.value });
                      }}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={saveResource}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditResourceModal;
