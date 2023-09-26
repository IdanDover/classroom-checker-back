import { Request, Response } from "express";
import fileService from "../services/fileService";

const getFile = async (req: Request, res: Response) => {
  const data = await fileService.getFile(req.query.time);
  res.status(200).json({ status: "success", data });
};

const updateFile = async (req: Request, res: Response) => {
  const data = await fileService.updateFile(req.query.time, req.file?.filename);
  res.status(201).json({ status: "success", data });
};

const updateFiles = async (req: Request, res: Response) => {
  const data = await fileService.updateFiles(req.files);
  res.status(201).json({ status: "success", data });
};

export = { updateFile, getFile, updateFiles };
