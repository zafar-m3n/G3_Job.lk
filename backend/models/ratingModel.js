import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

export const insertRating = (rating, callback) => {
  const query =
    "INSERT INTO ratings (freelancerId, employerId, rating, review) VALUES (?)";
  db.query(query, [rating], callback);
};
