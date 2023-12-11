import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

export const insertJobBid = (bid, callback) => {
  const query =
    "INSERT INTO bids (bidAmount, deadline, deliverables, additionalInfo, phoneNumber, freelancerName, freelancerEmail, freelancerId, employerName, employerEmail, employerId, jobId) VALUES (?)";
  db.query(query, [bid], callback);
};

//get all bids for a job from one freelancer
export const getJobBids = (jobId, freelancerId, callback) => {
  const query =
    "SELECT * FROM bids WHERE jobId = ? AND freelancerId = ? ORDER BY bidID DESC";
  db.query(query, [jobId, freelancerId], callback);
};
