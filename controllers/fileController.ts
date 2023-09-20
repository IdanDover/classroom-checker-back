import { Request, Response } from "express";
import fileService from "../services/fileService";

const updateFile = (req: Request, res: Response) => {
  const data = fileService.updateFile(req.query.time, req.file?.filename);
  res.status(201).json({ status: "success", data });
};

const getFile = async (req: Request, res: Response) => {
  const data = await fileService.getFile(req.query.time);
  res.status(200).json({ status: "success", data });
};

export = { updateFile, getFile };
