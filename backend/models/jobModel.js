import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

// const db = mysql.createConnection({
//   host: "34.87.87.40",
//   user: "root",
//   password: "123456789",
//   database: "freelancer_system",
// });

export const insertJob = (job, callback) => {
  const query =
    "INSERT INTO jobs (jobTitle, jobDescription, requiredSkills, estimatedBudget, projectDuration, experienceLevel, location, additionalInfo, employerId) VALUES (?)";

  db.query(query, [job], callback);
};

export const getJobFromEmployer = (jobId, callback) => {
  const query = "SELECT * FROM jobs WHERE employerId = ?";
  db.query(query, [jobId], callback);
};

export const getAllJobs = (callback) => {
  const query = "SELECT * FROM jobs";
  db.query(query, callback);
};

export const getJobById = (jobId, callback) => {
  const query = "SELECT * FROM jobs WHERE id = ?";
  db.query(query, [jobId], callback);
};
