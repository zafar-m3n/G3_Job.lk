import { useState } from "react";
import axios from "axios";
import "../styles/RatingModal.css";

function RatingModal({ freelancerId, employerId, onRatingSubmit }) {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [hover, setHover] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      freelancerId: freelancerId,
      employerId: employerId,
      rating: rating,
      review: review,
    };

    try {
      const res = await axios.post(
        "http://localhost:8081/submitRating",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("auth"))?.token
            }`,
          },
        }
      );
      setRating(null);
      setReview("");
      setShow(false);
      if (onRatingSubmit) {
        onRatingSubmit();
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="btn btn-outline-primary mb-2" onClick={handleShow}>
        Rate Freelancer
      </button>
      {show && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rate Freelancer</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <p className="text-start">Rating: {rating}</p>
                  {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                      <label key={i}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                          style={{ display: "none" }}
                        />
                        <i
                          className={`fas fa-star star ${
                            ratingValue <= (hover || rating) ? "active" : ""
                          }`}
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                        />
                      </label>
                    );
                  })}
                  <textarea
                    className="form-control mt-3"
                    placeholder="Leave a review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {show && <div className="modal-backdrop show"></div>}
    </>
  );
}

export default RatingModal;
