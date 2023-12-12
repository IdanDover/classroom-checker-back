import express from "express";
import taskController from "../controllers/taskController";
import middlewareUtils from "../utils/middlewareUtils";
import authController from "../controllers/authController";

const router = express.Router();

router.use(authController.protect);

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
  authController.restrictTo("user", "manager", "admin"),
  taskController.getAllTasks
);
router.get(
  "/:id",
  authController.restrictTo("user", "manager", "admin"),
  taskController.getTask
);

router.post("/", authController.restrictTo("manager"), taskController.postTask);

router.put(
  "/:id",
  authController.restrictTo("manager"),
  taskController.updateTask
);

router.delete(
  "/:id",
  authController.restrictTo("manager"),
  taskController.deleteTask
);

export = router;
