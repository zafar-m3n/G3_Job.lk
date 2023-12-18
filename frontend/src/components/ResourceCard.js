import React from "react";
import "../styles/ResourceCardStyle.css";

function ResourceCard({ resource }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="resource-card">
        <h5 className="card-title">{resource.title}</h5>
        <p className="mb-2 text-muted">{resource.category}</p>
        <p className="mb-2 text-muted fw-semibold">
          <i className="fas fa-star text-warning me-2"></i>
          {resource.rating}({resource.numberOfRatings} reviews)
        </p>
        <p className="card-text">{resource.description}</p>
        <a
          href={resource.url}
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

export default ResourceCard;
