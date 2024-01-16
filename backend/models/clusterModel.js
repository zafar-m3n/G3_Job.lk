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

//get all clusters with member count for employers
export const getClustersEmployer = (callback) => {
  const query = `
    SELECT c.cluster_id, c.cluster_name, c.cluster_description, COUNT(m.member_id) as member_count 
    FROM freelancer_clusters c 
    INNER JOIN cluster_members m ON c.cluster_id = m.cluster_id 
    GROUP BY c.cluster_id
    HAVING COUNT(m.member_id) > 0;`;

  db.query(query, callback);
};

//add new cluster
export const addCluster = (cluster, callback) => {
  const query = "INSERT INTO freelancer_clusters SET ?";
  db.query(query, cluster, callback);
};

//get cluster data by id
export const getClusterDataById = (clusterId, callback) => {
  const query = `
    SELECT f.cluster_id, f.cluster_name, f.cluster_description, u.id,
           u.first_name, u.last_name, u.email, u.district, c.joined_at
    FROM freelancer_clusters f
    JOIN cluster_members c ON f.cluster_id = c.cluster_id
    JOIN users u ON c.freelancer_id = u.id
    WHERE f.cluster_id = ?`;

  db.query(query, [clusterId], callback);
};

//join cluster
export const joinCluster = (clusterMember, callback) => {
  const query = "INSERT INTO cluster_members SET ?";
  db.query(query, clusterMember, callback);
};

//leave cluster
export const leaveCluster = (clusterMember, callback) => {
  const query =
    "DELETE FROM cluster_members WHERE cluster_id = ? AND freelancer_id = ?";
  db.query(
    query,
    [clusterMember.cluster_id, clusterMember.freelancer_id],
    callback
  );
};
