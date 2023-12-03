import React from "react";
import "../styles/JobCardStyle.css";
import { useNavigate } from "react-router-dom";

function JobCard({ job }) {
  const navigate = useNavigate();
  const handleSeeMoreClick = () => {
    navigate(`/job-details/${job.id}`);
  }
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <div className="card-body">
          {/* Job Title and Experience Level */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title">{job.jobTitle}</h5>
            <span
              className={`badge ${
                job.experienceLevel === "Beginner"
                  ? "bg-info"
                  : job.experienceLevel === "Intermediate"
                  ? "bg-secondary"
                  : "bg-success"
              }`}
            >
              {job.experienceLevel}
            </span>
          </div>

          {/* Budget, Duration, Location */}
          <div className="d-flex text-secondary mb-3">
            <div className="m-auto">
              <div>LKR {job.estimatedBudget}</div>
              <div className="card-label">Budget</div>
            </div>
            <div className="m-auto">
              <div>{job.projectDuration}</div>
              <div className="card-label">Duration</div>
            </div>
            <div className="m-auto">
              <div>{job.location}</div>
              <div className="card-label">Location</div>
            </div>
          </div>

          {/* Job Description */}
          <p className="card-text">
            {job.jobDescription.length > 100
              ? job.jobDescription.substring(0, 100) + "..."
              : job.jobDescription}
          </p>

          {/* Skills */}
          <div className="mb-3">
            <strong>Skills:</strong> {job.requiredSkills}
          </div>
        </div>

        {/* See More Button */}
        <div className="card-footer">
          <button className="button-custom w-100" onClick={handleSeeMoreClick}>
            See More
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
