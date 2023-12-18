import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

//get all resources
export const getAllResources = (callback) => {
  const query = "SELECT * FROM resources";
  db.query(query, callback);
};
