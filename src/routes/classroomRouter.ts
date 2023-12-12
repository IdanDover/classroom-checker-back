import express from "express";
import crController from "../controllers/classroomController";
import middlewareUtils from "../utils/middlewareUtils";
import authController from "../controllers/authController";

const router = express.Router();

router.use(authController.protect);

router.get(
  "/",
  middlewareUtils.whiteListUrlQuery([
    "classNum",
    "courseSet",
    "camera",
    "courseName",
    "comment",
    "time",
    "completed",
    "sort",
    "page",
    "count",
  ]),
  authController.restrictTo("user", "manager", "admin"),
  crController.getAllCr
);
router.get(
  "/:id",
  authController.restrictTo("user", "manager", "admin"),
  crController.getCr
);

router.post("/", authController.restrictTo("manager"), crController.postCr);

router.put("/:id", authController.restrictTo("manager"), crController.updateCr);

router.delete(
  "/:id",
  authController.restrictTo("manager"),
  crController.deleteCr
);

export = router;
