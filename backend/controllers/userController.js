import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/userModel.js";
import * as jobModel from "../models/jobModel.js";
import e from "express";
import path from "path";

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

export const postJob = async (req, res) => {
  try {
    const job = [
      req.body.jobTitle,
      req.body.jobDescription,
      req.body.requiredSkills,
      req.body.estimatedBudget,
      req.body.projectDuration,
      req.body.experienceLevel,
      req.body.location,
      req.body.additionalInfo,
      req.body.employer,
    ];
    jobModel.insertJob(job, (err, result) => {
      if (err) return res.json({ Error: err.message });
      const jobId = result.insertId;
      return res.json({
        Status: "Success",
        job: {
          job_id: result.insertId,
          job_title: req.body.jobTitle,
          job_description: req.body.jobDescription,
          required_skills: req.body.requiredSkills,
          estimated_budget: req.body.estimatedBudget,
          project_duration: req.body.projectDuration,
          experience_level: req.body.experienceLevel,
          location: req.body.location,
          additional_info: req.body.additionalInfo,
          employer_email: req.body.employer,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const getJobData = async (req, res) => {
  try {
    UserModel.findOne(req.user.id, (err, users) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Error finding user" });
      }
      if (users.length === 0) {
        return res.json({ Error: "Employer not found" });
      }
      const employer = users[0];

      // Use the found employer's email to get jobs
      jobModel.getJobFromEmployer(employer.email, (err, jobs) => {
        if (err) {
          console.log(err);
          return res.json({ Error: "Error finding jobs" });
        }
        res.json({ Status: "Success", Jobs: jobs });
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const getJobDataFreelancer = async (req, res) => {
  try {
    jobModel.getAllJobs((err, jobs) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: "Error finding jobs" });
      }
      res.status(200).json({ Status: "Success", Jobs: jobs });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};


//update user data
export const updateUserData = async (req, res) => {
  try {
    const user = [req.body.profileImage, req.body.location, req.body.email];
    console.log("Before update: " + user);
    UserModel.updateUser(user, (err, result) => {
      if (err) return res.json({ Error: err.message });
      console.log("After update: " + user);
      return res.json({
        Status: "Success",
        user: {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          district: req.body.district,
          user_role: req.body.userRole,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // The file path where the image is stored
    const imagePath = req.file.path;

    // Here, you'd typically update the user's profile in the database with the imagePath
    // For now, just return the file path.
    res.status(200).json({ imageUrl: imagePath });
  } catch (error) {
    res.status(500).send("Server error during image upload.");
  }
};
