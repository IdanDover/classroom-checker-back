import express from "express";
import multer from "multer";
import path from "path";
import fileController from "../controllers/fileController";

//TODO: check for a way to not save the file to disk
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

const router = express.Router();
//NOTE:make it use the middleware as such:
// 1.parse the file
// 2.change it to entities
// 3.compare classes between different times
// 4.save to redis
router.post("/", upload.single("file"), fileController.updateFile);

router.post(
  "/today",
  upload.fields([
    { name: "noon", maxCount: 1 },
    { name: "evening", maxCount: 1 },
  ]),
  fileController.updateFiles
);

export = router;
