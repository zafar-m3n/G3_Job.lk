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

//get all bids for a job
export const getAllJobBids = (jobId, callback) => {
  const query =
    "SELECT bidId, bidAmount, deadline, deliverables, additionalInfo, phoneNumber, freelancerId, freelancerName, jobId, status, profile_image FROM bids, users WHERE bids.freelancerId = users.id && jobId = ? ORDER BY status ASC, bidID DESC";
  db.query(query, [jobId], callback);
};

//get a single bid details
export const getSingleBid = (bidId, callback) => {
  const query =
    "SELECT bidId, bidAmount, deadline, deliverables, additionalInfo, phoneNumber, freelancerId, freelancerName, jobId, profile_image, status FROM bids, users WHERE bids.freelancerId = users.id && bidId = ?";
  db.query(query, [bidId], callback);
};

export const acceptBid = (bidId, jobId, callback) => {
  const queryAwarded = "UPDATE bids SET status = 'awarded' WHERE bidId = ?";
  db.query(queryAwarded, [bidId], (err, result) => {
    if (err) {
      return callback(err);
    }
    const queryDeclined =
      "UPDATE bids SET status = 'declined' WHERE jobId = ? AND status != 'awarded'";
    db.query(queryDeclined, [jobId], callback);
  });
};

//decline bid
export const declineBid = (bidId, callback) => {
  const query = "UPDATE bids SET status = 'declined' WHERE bidId = ?";
  db.query(query, [bidId], callback);
};
