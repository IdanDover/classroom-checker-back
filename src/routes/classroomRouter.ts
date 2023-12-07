import express from "express";
import crController from "../controllers/classroomController";
import middlewareUtils from "../utils/middlewareUtils";

const router = express.Router();

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
  crController.getAllCr
);
router.get("/:id", crController.getCr);

router.post("/", crController.postCr);

router.put("/:id", crController.updateCr);

router.delete("/:id", crController.deleteCr);

export = router;
