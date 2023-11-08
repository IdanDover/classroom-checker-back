import express from "express";
import taskController from "../controllers/taskController";

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTask);

router.post("/", taskController.postTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

export = router;
