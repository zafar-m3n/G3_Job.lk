import React from "react";

function FreelancerCard({ freelancer }) {
  return (
    <div className="col-3 mb-4">
      <div className="card text-center p-2">
        <img
          src={freelancer.profile_image}
          className="profile"
          alt="Freelancer"
        />
        <div className="card-body">
          <h5 className="card-title m-0">
            {freelancer.first_name} {freelancer.last_name}
          </h5>
          {freelancer.description === "No description added" ||
          freelancer.description === null ? (
            <p className="card-text">
              <br />
            </p>
          ) : (
            <p className="card-text">{freelancer.description}</p>
          )}
          <p className="card-text text-muted">
            <i className="fas fa-star me-2 text-warning"></i>
            {freelancer.rating}/5
          </p>
          <a href={`/freelancer/${freelancer.id}`} className="btn btn-primary">
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default FreelancerCard;
