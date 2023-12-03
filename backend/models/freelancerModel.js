import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

export const insertFreelancer = (freelancer, callback) => {
  const query =
    "INSERT INTO freelancers (profileID, userID, description, languages, skills, portfolioWebsite) VALUES (?)";
  db.query(query, [freelancer], callback);
};

export const findFreelancerById = (userId, callback) => {
  const query = "SELECT * FROM freelancers WHERE userID = ?";
  db.query(query, [userId], callback);
};

export const updateFreelancerDescription = (freelancer, callback) => {
  const query = "UPDATE freelancers SET description = ? WHERE userId = ?";
  db.query(query, [freelancer.description, freelancer.userID], callback);
};
export const updateFreelancerLanguages = (freelancer, callback) => {
  const query = "UPDATE freelancers SET languages = ? WHERE userId = ?";
  db.query(query, [freelancer.languages, freelancer.userID], callback);
};

export const updateFreelancerSkills = (freelancer, callback) => {
  const query = "UPDATE freelancers SET skills = ? WHERE userId = ?";
  db.query(query, [freelancer.skills, freelancer.userID], callback);
};

export const updateFreelancerWebsite = (freelancer, callback) => {
  const query = "UPDATE freelancers SET portfolioWebsite = ? WHERE userId = ?";
  db.query(query, [freelancer.portfolio, freelancer.userID], callback);
};
