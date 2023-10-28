import express from "express";
import crController from "../controllers/classroomController";

const router = express.Router();

router.get("/", crController.getAllCr);
router.get("/:id", crController.getCr);

router.post("/", crController.postCr);

export = router;
