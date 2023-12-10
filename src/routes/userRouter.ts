import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

export = router;
