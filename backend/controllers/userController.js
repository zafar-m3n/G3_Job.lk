import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/userModel.js";
import e from "express";

const saltRounds = 10;

export const register = (req, res) => {
  UserModel.findUserByEmail(req.body.email, (err, users) => {
    if (err) return res.json({ Error: "Database query error" });
    if (users.length > 0) return res.json({ Error: "Email is already in use" });

    bcrypt.hash(req.body.password.toString(), saltRounds, (err, hash) => {
      if (err) return res.json({ Error: "Error for hashing password" });

      const user = [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        hash,
        req.body.district,
        req.body.userRole,
      ];

      UserModel.insertUser(user, (err, result) => {
        if (err) return res.json({ Error: err.message });
        const userId = result.insertId;
        const token = jwt.sign({ id: userId }, "CCG3ZNARCH", {
          expiresIn: "1d",
        });
        return res.json({
          Status: "Success",
          user: {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            district: req.body.district,
            user_role: req.body.userRole,
          },
          token,
        });
      });
    });
  });
};

export const login = (req, res) => {
  UserModel.findUserByEmail(req.body.email, (err, users) => {
    if (err) return res.json({ Error: err.message });
    if (users.length === 0)
      return res.json({ Error: "Invalid email or password" });

    bcrypt.compare(
      req.body.password.toString(),
      users[0].password,
      (err, match) => {
        if (err) return res.json({ Error: "Error for comparing password" });
        if (match) {
          const token = jwt.sign({ id: users[0].id }, "CCG3ZNARCH", {
            expiresIn: "1d",
          });
          return res.json({
            Status: "Success",
            userRole: users[0].user_role,
            token,
          });
        } else {
          return res.json({ Error: "Invalid email or password" });
        }
      }
    );
  });
};

export const getUserData = async (req, res) => {
  try {
    UserModel.findOne(req.user.id, (err, users) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database query error" });
      }
      if (users.length === 0) {
        return res.json({ Error: "User not found" });
      }
      const user = users[0];
      res.json({ Status: "Success", user: user });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};
