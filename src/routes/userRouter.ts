import express from "express";
import authController from "../controllers/authController";
import userController from "../controllers/userController";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/forgotPassword", authController.forgotPassword);
router.put("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.get("/me", userController.getMe);
router.put("/me", userController.updateMe);
router.delete("/me", userController.deleteMe);

router.put("/updatePassword", userController.updatePassword);

export = router;
