import { Request, Response } from "express";
import xlsx from "node-xlsx";

function uploadFile(req: Request, res: Response) {
  const worksheet = xlsx.parse(`${__dirname}/../uploads/${req.file?.filename}`);

  const data = worksheet[Number(process.env.SHEET_NUM)].data;

  res.status(201).json({ status: "success", data });
}

export = { uploadFile };
