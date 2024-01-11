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

//get all clusters with member count
export const getAllClusters = (callback) => {
  const query =
    "SELECT c.cluster_id, c.cluster_name, c.cluster_description, COUNT(m.member_id) as member_count FROM freelancer_clusters c LEFT JOIN cluster_members m ON c.cluster_id = m.cluster_id GROUP BY c.cluster_id;";
  db.query(query, callback);
};
