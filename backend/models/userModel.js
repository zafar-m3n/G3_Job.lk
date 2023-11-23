import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

export const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

export const insertUser = (user, callback) => {
  const query =
    "INSERT INTO users (first_name, last_name, email, password, district, user_role) VALUES (?)";
  db.query(query, [user], callback);
};

export const findOne = (id, callback) => {
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], callback);
};

export const updateUser = (user, callback) => {
  const query =
    "UPDATE users SET profile_image = ?, district = ? WHERE email = ?";
  db.query(query, user, callback);
};
