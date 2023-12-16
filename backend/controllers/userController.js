import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/userModel.js";
import * as jobModel from "../models/jobModel.js";
import * as freelancerModel from "../models/freelancerModel.js";
import * as employerModel from "../models/employerModel.js";
import * as bidModel from "../models/bidModel.js";
import e, { json } from "express";
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

export const updateUserData = async (req, res) => {
  try {
    const user = [req.body.profileImage, req.body.location, req.body.email];
    UserModel.updateUser(user, (err, result) => {
      if (err) return res.json({ Error: err.message });
      return res.json({
        Status: "Success",
        user: {
          first_name: req.body.name.split(" ")[0],
          last_name: req.body.name.split(" ")[1],
          email: req.body.email,
          district: req.body.location,
          user_role: req.body.role,
          profile_image: req.body.profileImage,
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
    const imagePath = req.file.filename;
    res.status(200).json({ imageUrl: imagePath });
  } catch (error) {
    res.status(500).send("Server error during image upload.");
  }
};

export const getFreelancerData = async (req, res) => {
  try {
    UserModel.findOne(req.user.id, (err, users) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Error finding user" });
      }
      if (users.length === 0) {
        return res.json({ Error: "Freelancer not found" });
      }
      const freelancer = users[0];
      // Use the found freelancer's email to get the details
      freelancerModel.findFreelancerById(freelancer.id, (err, freelancer) => {
        if (err) {
          console.log(err);
          return res.json({ Error: "Error finding freelancer" });
        }
        if (!freelancer || freelancer.length === 0) {
          return res.json({ Message: "No profile details" });
        }
        res.json({ Status: "Success", freelancer: freelancer });
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const getEmployerData = async (req, res) => {
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
      employerModel.findEmployerById(employer.id, (err, employer) => {
        if (err) {
          console.log(err);
          return res.json({ Error: "Error finding employer" });
        }
        if (!employer || employer.length === 0) {
          return res.json({ Message: "No profile details" });
        }
        res.json({ Status: "Success", employer: employer });
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const updateEmployerDescription = async (req, res) => {
  try {
    const employerData = {
      profileID: req.body.profileID,
      userID: req.body.userID,
      description: req.body.description,
      languages: req.body.languages,
      website: req.body.website,
    };

    // Check if employer exists
    employerModel.findEmployerById(employerData.userID, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Error in database operation" });
      }

      if (result.length > 0) {
        // Employer exists, update description
        employerModel.updateEmployerDescription(
          employerData,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return res.json({ Error: "Error updating employer" });
            }
            return res.json({ Status: "Success", Message: "Employer updated" });
          }
        );
      } else {
        // Employer doesn't exist, insert new record
        employerModel.insertEmployer(
          [
            employerData.profileID,
            employerData.userID,
            employerData.description,
            employerData.languages,
            employerData.website,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.json({ Error: "Error inserting new employer" });
            }
            return res.json({
              Status: "Success",
              Message: "New employer created",
            });
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const updateEmployerLanguages = async (req, res) => {
  try {
    const employerData = {
      profileID: req.body.profileID,
      userID: req.body.userID,
      description: req.body.description,
      languages: req.body.languages,
      website: req.body.website,
    };

    // Check if employer exists
    employerModel.findEmployerById(employerData.userID, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Error in database operation" });
      }

      if (result.length > 0) {
        // Employer exists, update description
        employerModel.updateEmployerLanguages(
          employerData,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return res.json({ Error: "Error updating employer" });
            }
            return res.json({ Status: "Success", Message: "Employer updated" });
          }
        );
      } else {
        // Employer doesn't exist, insert new record
        employerModel.insertEmployer(
          [
            employerData.profileID,
            employerData.userID,
            employerData.description,
            employerData.languages,
            employerData.website,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.json({ Error: "Error inserting new employer" });
            }
            return res.json({
              Status: "Success",
              Message: "New employer created",
            });
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const updateEmployerWebsite = async (req, res) => {
  try {
    const employerData = {
      profileID: req.body.profileID,
      userID: req.body.userID,
      description: req.body.description,
      languages: req.body.languages,
      website: req.body.website,
    };

    // Check if employer exists
    employerModel.findEmployerById(employerData.userID, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Error in database operation" });
      }

      if (result.length > 0) {
        // Employer exists, update description
        employerModel.updateEmployerWebsite(
          employerData,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return res.json({ Error: "Error updating employer" });
            }
            return res.json({ Status: "Success", Message: "Employer updated" });
          }
        );
      } else {
        // Employer doesn't exist, insert new record
        employerModel.insertEmployer(
          [
            employerData.profileID,
            employerData.userID,
            employerData.description,
            employerData.languages,
            employerData.website,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.json({ Error: "Error inserting new employer" });
            }
            return res.json({
              Status: "Success",
              Message: "New employer created",
            });
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const updateFreelancerDescription = async (req, res) => {
  try {
    const freelancerData = {
      profileID: req.body.profileID,
      userID: req.body.userID,
      description: req.body.description,
      languages: req.body.languages,
      portfolio: req.body.portfolioWebsite,
      skills: req.body.skills,
    };
    freelancerModel.findFreelancerById(freelancerData.userID, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Error in database operation" });
      }

      if (result.length > 0) {
        freelancerModel.updateFreelancerDescription(
          freelancerData,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return res.json({ Error: "Error updating freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "Freelancer updated",
            });
          }
        );
      } else {
        freelancerModel.insertFreelancer(
          [
            freelancerData.profileID,
            freelancerData.userID,
            freelancerData.description,
            freelancerData.languages,
            freelancerData.skills,
            freelancerData.portfolio,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.json({ Error: "Error inserting new freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "New freelancer profile created",
            });
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const updateFreelancerLanguages = async (req, res) => {
  try {
    const freelancerData = {
      profileID: req.body.profileID,
      userID: req.body.userID,
      description: req.body.description,
      languages: req.body.languages,
      portfolio: req.body.portfolioWebsite,
      skills: req.body.skills,
    };
    freelancerModel.findFreelancerById(freelancerData.userID, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Error in database operation" });
      }

      if (result.length > 0) {
        freelancerModel.updateFreelancerLanguages(
          freelancerData,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return res.json({ Error: "Error updating freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "Freelancer updated",
            });
          }
        );
      } else {
        freelancerModel.insertFreelancer(
          [
            freelancerData.profileID,
            freelancerData.userID,
            freelancerData.description,
            freelancerData.languages,
            freelancerData.skills,
            freelancerData.portfolio,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.json({ Error: "Error inserting new freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "New freelancer profile created",
            });
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const updateFreelancerSkills = async (req, res) => {
  try {
    const freelancerData = {
      profileID: req.body.profileID,
      userID: req.body.userID,
      description: req.body.description,
      languages: req.body.languages,
      portfolio: req.body.portfolioWebsite,
      skills: req.body.skills,
    };
    freelancerModel.findFreelancerById(freelancerData.userID, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Error in database operation" });
      }

      if (result.length > 0) {
        freelancerModel.updateFreelancerSkills(
          freelancerData,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return res.json({ Error: "Error updating freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "Freelancer updated",
            });
          }
        );
      } else {
        freelancerModel.insertFreelancer(
          [
            freelancerData.profileID,
            freelancerData.userID,
            freelancerData.description,
            freelancerData.languages,
            freelancerData.skills,
            freelancerData.portfolio,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.json({ Error: "Error inserting new freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "New freelancer profile created",
            });
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const updateFreelancerWebsite = async (req, res) => {
  try {
    const freelancerData = {
      profileID: req.body.profileID,
      userID: req.body.userID,
      description: req.body.description,
      languages: req.body.languages,
      portfolio: req.body.portfolioWebsite,
      skills: req.body.skills,
    };
    freelancerModel.findFreelancerById(freelancerData.userID, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Error in database operation" });
      }

      if (result.length > 0) {
        freelancerModel.updateFreelancerWebsite(
          freelancerData,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return res.json({ Error: "Error updating freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "Freelancer updated",
            });
          }
        );
      } else {
        freelancerModel.insertFreelancer(
          [
            freelancerData.profileID,
            freelancerData.userID,
            freelancerData.description,
            freelancerData.languages,
            freelancerData.skills,
            freelancerData.portfolio,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.json({ Error: "Error inserting new freelancer" });
            }
            return res.json({
              Status: "Success",
              Message: "New freelancer profile created",
            });
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const getSingleJobData = async (req, res) => {
  try {
    jobModel.getJobById(req.params.jobId, (err, jobs) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: "Error finding jobs" });
      }
      res.status(200).json({ Status: "Success", Jobs: jobs[0] });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};

export const getEmployerDataByEmail = async (req, res) => {
  try {
    UserModel.findUserByEmail(req.params.email, (err, employer) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: "Error finding employer" });
      }
      if (employer.length === 0) {
        return res.status(404).json({ Message: "Employer not found" });
      }
      res.status(200).json({ Status: "Success", Employer: employer });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};

export const insertJobBid = (req, res) => {
  const bid = [
    req.body.bidAmount,
    req.body.deadline,
    req.body.deliverables,
    req.body.additionalInfo,
    req.body.phoneNumber,
    req.body.freelancerName,
    req.body.freelancerEmail,
    req.body.freelancerId,
    req.body.employerName,
    req.body.employerEmail,
    req.body.employerId,
    req.body.jobId,
  ];
  bidModel.insertJobBid(bid, (err, result) => {
    if (err) return res.json({ Error: err.message });
    return res.json({
      Status: "Success",
      bid: {
        bid_id: result.insertId,
        bid_amount: req.body.bidAmount,
        deadline: req.body.deadline,
        deliverables: req.body.deliverables,
        additional_info: req.body.additionalInfo,
        phone_number: req.body.phoneNumber,
        freelancer_name: req.body.freelancerName,
        freelancer_email: req.body.freelancerEmail,
        freelancer_id: req.body.freelancerId,
        employer_name: req.body.employerName,
        employer_email: req.body.employerEmail,
        employer_id: req.body.employerId,
        job_id: req.body.jobId,
      },
    });
  });
};

export const getJobBids = (req, res) => {
  try {
    bidModel.getJobBids(
      req.params.jobId,
      req.params.freelancerId,
      (err, bids) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ Error: "Error finding bids" });
        }
        res.status(200).json({ Status: "Success", Bids: bids });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};

export const getAllJobBids = (req, res) => {
  try {
    bidModel.getAllJobBids(req.params.jobId, (err, bids) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: "Error finding bids" });
      }
      res.status(200).json({ Status: "Success", Bids: bids });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};

export const getSingleBid = (req, res) => {
  try {
    bidModel.getSingleBid(req.params.bidId, (err, bid) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: "Error finding bid" });
      }
      console.log("Bid Data:" + JSON.stringify(bid[0], null, 2));
      res.status(200).json({ Status: "Success", Bids: bid[0] });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};

export const acceptBid = (req, res) => {
  try {
    bidModel.acceptBid(req.body.bidId, req.body.jobId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: "Error accepting bid" });
      }
      return res.status(200).json({
        Status: "Success",
        Message: `Job has been awarded to ${req.body.freelancerName}`,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};

export const declineBid = (req, res) => {
  try {
    bidModel.declineBid(req.body.bidId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: "Error declining bid" });
      }
      return res
        .status(200)
        .json({ Status: "Success", Message: "Bid has been declined" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error" });
  }
};

//get all freelancers data
export const getFreelancersData = async (req, res) => {
  try {
    UserModel.findFreelancers(async (err, freelancers) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database query error" });
      }
      if (freelancers.length === 0) {
        return res.json({ Error: "No freelancers found" });
      }

      const freelancersData = await Promise.all(
        freelancers.map(async (freelancer) => {
          try {
            const additionalData = await freelancerModel.findFreelancerByUserId(
              freelancer.id
            );
            return {
              ...freelancer,
              description: additionalData.length
                ? additionalData[0].description
                : null,
              languages: additionalData.length
                ? additionalData[0].languages
                : null,
              skills: additionalData.length ? additionalData[0].skills : null,
              experienceLevel: additionalData.length
                ? additionalData[0].experienceLevel
                : null,
              portfolioWebsite: additionalData.length
                ? additionalData[0].portfolioWebsite
                : null,
              rating: additionalData.length ? additionalData[0].rating : "0",
            };
          } catch (error) {
            console.error(error);
            return {
              ...freelancer,
              description: null,
              languages: null,
              skills: null,
              experienceLevel: null,
              portfolioWebsite: null,
              rating: "0",
            };
          }
        })
      );

      res.json({ Status: "Success", freelancers: freelancersData });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};
