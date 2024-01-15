import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DeleteResourceModal({ resource, onSuccess }) {
  const resourceId = resource.id;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //delete resource
  const deleteResource = async () => {
    try {
      const response = await axios.post(
        "https://g3-job-lk.onrender.com/deleteResource",
        { resourceId },
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
      console.error("Error deleting resource:", error);
    }
  };
  return (
    <>
      <Button variant="outline-danger" onClick={handleShow}>
        Remove
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Educational Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this educational resource? <br />
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteResource}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteResourceModal;
