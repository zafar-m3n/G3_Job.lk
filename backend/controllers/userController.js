import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/userModel.js";
import * as jobModel from "../models/jobModel.js";
import * as freelancerModel from "../models/freelancerModel.js";
import * as employerModel from "../models/employerModel.js";
import * as bidModel from "../models/bidModel.js";
import * as ratingModel from "../models/ratingModel.js";
import * as resourceModel from "../models/resourceModel.js";
import * as endorsementModel from "../models/endorsementModel.js";
import * as clusterModel from "../models/clusterModel.js";
import e, { json } from "express";
import path from "path";

const saltRounds = 10;

export const register = (req, res) => {
  UserModel.findUserByEmail(req.body.email, (err, users) => {
    if (err) return res.json({ Error: "Database query error" + err });
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
    const requiredFields = [
      "jobTitle",
      "jobDescription",
      "requiredSkills",
      "estimatedBudget",
      "projectDuration",
      "experienceLevel",
      "location",
      "employer",
    ];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.json({ Error: "Incomplete job data" });
      }
    }
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

export const getFreelancerDataById = async (req, res) => {
  try {
    UserModel.findOne(req.params.freelancerId, (err, freelancerUser) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database query error" });
      }
      if (freelancerUser.length === 0) {
        return res.json({ Error: "Freelancer not found" });
      }

      freelancerModel.findFreelancerById(
        req.params.freelancerId,
        (err, freelancerDetails) => {
          if (err) {
            console.log(err);
            return res.json({
              Error: "Database query error in FreelancerModel",
            });
          }

          const freelancerData = {
            ...freelancerUser[0],
            description: freelancerDetails.length
              ? freelancerDetails[0].description
              : null,
            languages: freelancerDetails.length
              ? freelancerDetails[0].languages
              : null,
            skills: freelancerDetails.length
              ? freelancerDetails[0].skills
              : null,
            experienceLevel: freelancerDetails.length
              ? freelancerDetails[0].experienceLevel
              : null,
            portfolioWebsite: freelancerDetails.length
              ? freelancerDetails[0].portfolioWebsite
              : null,
            rating: freelancerDetails.length
              ? freelancerDetails[0].rating
              : "0",
          };

          console.log(
            "Freelancer Info:" + JSON.stringify(freelancerData, null, 2)
          );
          res.json({
            Status: "Success",
            freelancer: freelancerData,
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const submitRating = async (req, res) => {
  try {
    const rating = [
      req.body.freelancerId,
      req.body.employerId,
      req.body.rating,
      req.body.review,
    ];
    ratingModel.insertRating(rating, (err, result) => {
      if (err) return res.json({ Error: err.message });
      return res.json({
        Status: "Success",
        rating: {
          freelancerId: req.body.freelancerId,
          employerId: req.body.employerId,
          rating: req.body.rating,
          review: req.body.review,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const getResources = (req, res) => {
  try {
    resourceModel.getAllResources((err, resources) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database query error" });
      }
      if (resources.length === 0) {
        return res.json({ Error: "No resources found" });
      }
      res.json({ Status: "Success", resources: resources });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

//endorse skills
export const endorseSkills = (req, res) => {
  try {
    console.log("In the controller" + JSON.stringify(req.body, null, 2));
    const { endorserId, freelancerId, skills } = req.body;
    endorsementModel.endorseSkills(
      endorserId,
      freelancerId,
      skills,
      (err, result) => {
        if (err) return res.json({ Error: err.message });
        return res.json({
          Status: "Success",
          Message: "Freelancer Skills endorsed",
          endorsement: {
            endorserId: endorserId,
            freelancerId: freelancerId,
            skills: skills,
          },
        });
      }
    );
  } catch (error) {
    console.log("Server error", error);
  }
};

export const getEmployersData = async (req, res) => {
  try {
    UserModel.findEmployers(async (err, employers) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database query error" });
      }
      if (employers.length === 0) {
        return res.json({ Error: "No employers found" });
      }

      const employersData = await Promise.all(
        employers.map(async (employer) => {
          try {
            const additionalData = await employerModel.findEmployerByUserId(
              employer.id
            );
            return {
              ...employer,
              description: additionalData.length
                ? additionalData[0].description
                : null,
              languages: additionalData.length
                ? additionalData[0].languages
                : null,
              website: additionalData.length ? additionalData[0].website : null,
            };
          } catch (error) {
            console.error(error);
            return {
              ...employer,
              description: null,
              languages: null,
              website: null,
            };
          }
        })
      );

      res.json({ Status: "Success", employers: employersData });
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const getEmployerDataById = async (req, res) => {
  try {
    console.log("In the controller");
    UserModel.findOne(req.params.employerId, (err, employerUser) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database query error" });
      }
      if (employerUser.length === 0) {
        return res.json({ Error: "Employer not found" });
      }

      employerModel.findEmployerById(
        req.params.employerId,
        (err, employerDetails) => {
          if (err) {
            console.log(err);
            return res.json({
              Error: "Database query error in EmployerModel",
            });
          }

          const employerData = {
            ...employerUser[0],
            description: employerDetails.length
              ? employerDetails[0].description
              : null,
            languages: employerDetails.length
              ? employerDetails[0].languages
              : null,
            website: employerDetails.length ? employerDetails[0].website : null,
          };

          console.log("Employer Info:" + JSON.stringify(employerData, null, 2));
          res.json({
            Status: "Success",
            employer: employerData,
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};
//get clusters
export const getClusters = (req, res) => {
  try {
    console.log("In the controller" + JSON.stringify(req.body, null, 2));
    const { userId } = req.body;
    clusterModel.getAllClusters((err, clusters) => {
      if (err) return res.json({ Error: err.message });
      return res.json({
        Status: "Success",
        Message: "Clusters found",
        clusters: clusters,
      });
    });
  } catch (error) {
    console.log("Server error", error);
  }
};

export const updateResource = async (req, res) => {
  try {
    console.log("In the controller" + JSON.stringify(req.body, null, 2));
    const resourceId = req.body.id; // Ensure the ID is sent in the request body
    const newData = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      url: req.body.url,
    };

    resourceModel.updateResource(resourceId, newData, (err, result) => {
      if (err) {
        res.status(500).send("Error updating resource");
      } else {
        res.status(200).send("Resource updated successfully!");
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const deleteResource = async (req, res) => {
  try {
    console.log("In the controller" + JSON.stringify(req.body, null, 2));
    const resourceId = req.body.resourceId; // Ensure the ID is sent in the request body

    resourceModel.deleteResource(resourceId, (err, result) => {
      if (err) {
        res.status(500).send("Error deleting resource");
      } else {
        res.status(200).send("Resource deleted successfully!");
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Error: "Server error" });
  }
};

export const addResource = (req, res) => {
  const resourceData = req.body;
  console.log("In the controller" + JSON.stringify(resourceData, null, 2));
  resourceModel.addResource(resourceData, (err, results) => {
    if (err) {
      console.error("Error adding resource:", err);
      return res.status(500).send(err);
    }
    res
      .status(200)
      .json({ message: "Resource added successfully", data: results });
  });
};

//add cluster
export const addCluster = (req, res) => {
  const clusterData = {
    cluster_name: req.body.name,
    cluster_description: req.body.description,
  };
  console.log("In the controller" + JSON.stringify(clusterData, null, 2));
  clusterModel.addCluster(clusterData, (err, results) => {
    if (err) {
      console.error("Error adding cluster:", err);
      return res.status(500).send(err);
    }
    res
      .status(200)
      .json({ message: "Cluster added successfully", data: results });
  });
};

//get cluster by id
export const getClusterDataById = (req, res) => {
  try {
    console.log("In the controller" + JSON.stringify(req.params, null, 2));
    const { clusterId } = req.params;
    clusterModel.getClusterDataById(clusterId, (err, cluster) => {
      if (err) return res.json({ Error: err.message });
      return res.json({
        Status: "Success",
        Message: "Cluster found",
        cluster: cluster,
      });
    });
  } catch (error) {
    console.log("Server error", error);
  }
};
export const getClustersEmployer = (req, res) => {
  try {
    console.log("In the controller" + JSON.stringify(req.body, null, 2));
    const { userId } = req.body;
    clusterModel.getClustersEmployer((err, clusters) => {
      if (err) return res.json({ Error: err.message });
      return res.json({
        Status: "Success",
        Message: "Clusters found",
        clusters: clusters,
      });
    });
  } catch (error) {
    console.log("Server error", error);
  }
};
