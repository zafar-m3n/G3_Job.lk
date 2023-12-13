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

//get a single bid details
router.get("/getBidData/:bidId", authMiddleware, UserController.getSingleBid);

//accept bid
router.post("/acceptBid", authMiddleware, UserController.acceptBid);

//decline bid
router.post("/declineBid", authMiddleware, UserController.declineBid);

export default router;
