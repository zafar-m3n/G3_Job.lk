import express from "express";
import * as UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../upload.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/getUserData", authMiddleware, UserController.getUserData);
router.post("/postJob", authMiddleware, UserController.postJob);
router.get("/getJobData", authMiddleware, UserController.getJobData);
router.get(
  "/getJobDataFreelancer",
  authMiddleware,
  UserController.getJobDataFreelancer
);
router.post(
  "/uploadProfileImage",
  upload.single("file"),
  UserController.uploadProfileImage
);
router.post("/updateUserData", authMiddleware, UserController.updateUserData);
router.get(
  "/getFreelancerData",
  authMiddleware,
  UserController.getFreelancerData
);
router.get("/getEmployerData", authMiddleware, UserController.getEmployerData);
router.post(
  "/updateEmployerDescription",
  authMiddleware,
  UserController.updateEmployerDescription
);
router.post(
  "/updateEmployerLanguages",
  authMiddleware,
  UserController.updateEmployerLanguages
);
router.post(
  "/updateEmployerWebsite",
  authMiddleware,
  UserController.updateEmployerWebsite
);

router.post(
  "/updateFreelancerDescription",
  authMiddleware,
  UserController.updateFreelancerDescription
);
router.post(
  "/updateFreelancerLanguages",
  authMiddleware,
  UserController.updateFreelancerLanguages
);

router.post(
  "/updateFreelancerSkills",
  authMiddleware,
  UserController.updateFreelancerSkills
);

router.post(
  "/updateFreelancerWebsite",
  authMiddleware,
  UserController.updateFreelancerWebsite
);

router.get(
  "/getJobData/:jobId",
  authMiddleware,
  UserController.getSingleJobData
);

router.get(
  "/getEmployerData/:email",
  authMiddleware,
  UserController.getEmployerDataByEmail
);

//bid routes
router.post("/submitBid", authMiddleware, UserController.insertJobBid);

//get all bids for a job from one freelancer
router.get(
  "/getJobBids/:jobId/:freelancerId",
  authMiddleware,
  UserController.getJobBids
);

//get all bids for a job
router.get(
  "/getAllJobBids/:jobId",
  authMiddleware,
  UserController.getAllJobBids
);

router.get("/getBidData/:bidId", authMiddleware, UserController.getSingleBid);

router.post("/acceptBid", authMiddleware, UserController.acceptBid);

router.post("/declineBid", authMiddleware, UserController.declineBid);

router.get(
  "/getFreelancersData",
  authMiddleware,
  UserController.getFreelancersData
);

router.get(
  "/getFreelancerData/:freelancerId",
  authMiddleware,
  UserController.getFreelancerDataById
);

router.post("/submitRating", authMiddleware, UserController.submitRating);

router.get("/getResources", authMiddleware, UserController.getResources);

router.post("/endorseSkills", authMiddleware, UserController.endorseSkills);

router.get(
  "/getEmployersData",
  authMiddleware,
  UserController.getEmployersData
);
//get clusters with member count
router.get(
  "/getSingleEmployerData/:employerId",
  authMiddleware,
  UserController.getEmployerDataById
);
router.get("/getClusters", authMiddleware, UserController.getClusters);
router.get(
  "/getClustersEmployer",
  authMiddleware,
  UserController.getClustersEmployer
);

//update resource
router.post("/updateResource", authMiddleware, UserController.updateResource);

//delete resource
router.post("/deleteResource", authMiddleware, UserController.deleteResource);

//add new resource
router.post("/addResource", authMiddleware, UserController.addResource);

//add cluster
router.post("/addCluster", authMiddleware, UserController.addCluster);

//get cluster data by id
router.get(
  "/getClusterData/:clusterId",
  authMiddleware,
  UserController.getClusterDataById
);

//join cluster
router.post("/joinCluster", authMiddleware, UserController.joinCluster);

//leave cluster
router.post("/leaveCluster", authMiddleware, UserController.leaveCluster);

router.post("/hireCluster", authMiddleware, UserController.hireCluster);

router.get(
  "/recommendedJobs/:userId",
  authMiddleware,
  UserController.getRecommendedJobs
);

//freelancer verification
router.get(
  "/getVerification/:userId",
  authMiddleware,
  UserController.getFreelancerAwardedBidsCount
);
export default router;
