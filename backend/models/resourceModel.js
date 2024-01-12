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

//get all resources
export const getAllResources = (callback) => {
  const query = "SELECT * FROM resources";
  db.query(query, callback);
};
export const updateResource = (resourceId, newData, callback) => {
  let sql = "UPDATE resources SET ? WHERE id = ?";
  db.query(sql, [newData, resourceId], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};
