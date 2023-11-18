import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
const salt = 10;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "freelancer_system",
});

app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO users (first_name, last_name, email, password, district, user_role) VALUES (?)";

  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      return res.json({ Error: "Error for hashing password" });
    }
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      hash,
      req.body.district,
      req.body.userRole,
    ];
    db.query(sql, [values], (err, result) => {
      if (err) {
        return res.json({ Error: err.message });
      }
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.body.email], (err, result) => {
    if (err) {
      return res.json({ Error: err.message });
    }
    if (result.length === 0) {
      return res.json({ Error: "User not found" });
    }
    bcrypt.compare(
      req.body.password.toString(),
      result[0].password,
      (err, match) => {
        if (err) {
          return res.json({ Error: "Error for comparing password" });
        }
        if (match) {
          return res.json({ Status: "Success", userRole: result[0].user_role });
        } else {
          return res.json({ Error: "Wrong password" });
        }
      }
    );
  });
});

app.listen(8081, () => {
  console.log("Running server");
});
