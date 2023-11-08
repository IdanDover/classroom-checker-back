import express from "express";
import crController from "../controllers/classroomController";

const router = express.Router();

router.get("/", crController.getAllCr);
router.get("/:id", crController.getCr);

router.post("/", crController.postCr);

router.put("/:id", crController.updateCr);

router.delete("/:id", crController.deleteCr);

export = router;
