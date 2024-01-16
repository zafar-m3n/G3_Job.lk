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

export const findEmployerById = (userId, callback) => {
  const query = "SELECT * FROM employers WHERE userId = ?";
  db.query(query, [userId], callback);
};

export const insertEmployer = (employer, callback) => {
  const query =
    "INSERT INTO employers (employerId, userId, description, languages, website) VALUES (?)";
  db.query(query, [employer], callback);
};

export const updateEmployerDescription = (employer, callback) => {
  const query = "UPDATE employers SET description = ? WHERE userId = ?";
  db.query(query, [employer.description, employer.userID], callback);
};

export const updateEmployerLanguages = (employer, callback) => {
  const query = "UPDATE employers SET languages = ? WHERE userId = ?";
  db.query(query, [employer.languages, employer.userID], callback);
};

export const updateEmployerWebsite = (employer, callback) => {
  const query = "UPDATE employers SET website = ? WHERE userId = ?";
  db.query(query, [employer.website, employer.userID], callback);
};
export const findEmployerByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM employers WHERE userID = ?";
    db.query(query, [userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
