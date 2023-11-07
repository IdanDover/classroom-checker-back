import express from "express";
import multer from "multer";
import path from "path";
import specialController from "../controllers/specialController";
import uploadData from "../../dev-data/uploadData";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (
    _req: any,
    _file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, "uploads/");
  },
  filename: function (
    _req: any,
    file: { originalname: any },
    cb: (arg0: null, arg1: any) => void
  ) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/oren",
  upload.fields([
    { name: "noon", maxCount: 1 },
    { name: "evening", maxCount: 1 },
  ]),
  specialController.uploadForOren
);
router.post("/uploadSampleData", uploadData.uploadCrs, uploadData.uploadTasks);

router.delete("/deleteAll", specialController.deleteAll);

export = router;
