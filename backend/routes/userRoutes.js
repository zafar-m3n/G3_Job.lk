import express from "express";
import * as UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/getUserData", authMiddleware, UserController.getUserData);
router.post("/postJob", authMiddleware, UserController.postJob);
router.get("/getJobData", authMiddleware, UserController.getJobData);

export default router;
