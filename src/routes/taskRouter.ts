import express from "express";
import taskController from "../controllers/taskController";
import middlewareUtils from "../utils/middlewareUtils";

const router = express.Router();

router.get(
  "/",
  middlewareUtils.whiteListUrlQuery([
    "taskNum",
    "courseSet",
    "description",
    "time",
    "completed",
    "sort",
    "page",
    "count",
  ]),
  taskController.getAllTasks
);
router.get("/:id", taskController.getTask);

router.post("/", taskController.postTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

export = router;
