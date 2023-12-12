import express from "express";
import multer from "multer";
import path from "path";
import specialController from "../controllers/specialController";
import AppError from "../errors/appError";
import middlewareUtils from "../utils/middlewareUtils";
import authController from "../controllers/authController";

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

const fileFilter = (_req: any, file: any, cb: Function) => {
  if (
    file.mimetype ==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
    return;
  }
  cb(
    new AppError("Not an Excel file! Please upload only excel files", 400),
    false
  );
};

const upload = multer({ storage, fileFilter });

router.get(
  "/floors",
  middlewareUtils.whiteListUrlQuery(["time", "sort"]),
  specialController.getFloors
);

router.post(
  "/oren",
  authController.protect,
  authController.restrictTo("manager"),
  upload.fields([
    { name: "noon", maxCount: 1 },
    { name: "evening", maxCount: 1 },
  ]),
  specialController.uploadForOren
);

export = router;
