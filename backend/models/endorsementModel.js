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

//get endorsements from database
export const endorseSkills = (endorserId, freelancerId, skills, callback) => {
  const query =
    "INSERT INTO endorsements (endorserId, freelancerId, skills) VALUES (?, ?, ?)";
  db.query(query, [endorserId, freelancerId, skills], callback);
};
