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
router.get("/getJobDataFreelancer", authMiddleware, UserController.getJobDataFreelancer);
router.post(
  "/uploadProfileImage",
  upload.single("file"),
  UserController.uploadProfileImage
);
router.post("/updateUserData", authMiddleware, UserController.updateUserData);

export default router;
