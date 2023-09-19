import express from "express";
import multer from "multer";
import path from "path";
import fileController from "../controllers/fileController";

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

router.post("/", upload.single("file"), fileController.uploadFile);

export = router;
