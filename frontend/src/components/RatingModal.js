import { useState } from "react";
import "../styles/RatingModal.css";

function RatingModal({ freelancerId, employerId }) {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [hover, setHover] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Freelancer ID:",
      freelancerId,
      "Employer ID:",
      employerId,
      "Rating:",
      rating,
      "Review:",
      review
    );
    setRating(null);
    setReview("");
    setShow(false);
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
