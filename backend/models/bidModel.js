import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

//insert job bid (bidAmount, deadline, deliverables, additionalInfo, phoneNumber, freelancerName, freelancerEmail, freelancerId, employerName, employerEmail, employerId)

export const insertJobBid = (bid, callback) => {
  const query =
    "INSERT INTO bids (bidAmount, deadline, deliverables, additionalInfo, phoneNumber, freelancerName, freelancerEmail, freelancerId, employerName, employerEmail, employerId, jobId) VALUES (?)";
  db.query(query, [bid], callback);
};
