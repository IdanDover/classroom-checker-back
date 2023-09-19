import express, { Express, Request, Response } from "express";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

import excel from "./excelParser";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/upload_files", upload.single("file"), uploadFiles);

function uploadFiles(req: Request, res: Response) {
  console.log(req.file);
  res.json({ message: "Successfully uploaded files" });
}

export = app;
