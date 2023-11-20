import express from "express";
import * as UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/getUserData", authMiddleware, UserController.getUserData);

export default router;
