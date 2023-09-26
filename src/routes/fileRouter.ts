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
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage });

const router = express.Router();

router
  .get("/", fileController.getFile)
  .post("/", upload.single("file"), fileController.updateFile);

export = router;
