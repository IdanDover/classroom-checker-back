import xlsx from "node-xlsx";
import fileRepo from "../repositories/fileRepo";
import { parseForRedis } from "../utils/excelUtils";
import fs from "fs";

const getFile = async (fileTime: any) => {
  const data = (await fileRepo.getFile(fileTime)) ?? "data was not received";
  return JSON.parse(data);
};

const updateFile = async (fileTime: any, filename: any) => {
  const worksheet = xlsx.parse(`${__dirname}/../../uploads/${filename}`);
  const data = worksheet[Number(process.env.SHEET_NUM)].data;
  const newData = parseForRedis(data);
  fs.unlink(`${__dirname}/../../uploads/${filename}`, (err) => {
    if (err) {
      console.log("error deleting file: ", err);
    }
  });
  // console.log(newData);

  return await fileRepo.updateFile(fileTime, newData);
};

export = { updateFile, getFile };
