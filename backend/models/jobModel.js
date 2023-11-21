import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

export const insertJob = (job, callback) => {
  const query =
    "INSERT INTO jobs (jobTitle, jobDescription, requiredSkills, estimatedBudget, projectDuration, experienceLevel, location, additionalInfo, employerName) VALUES (?)";

  db.query(query, [job], callback);
};
