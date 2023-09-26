import xlsx from "node-xlsx";
import fileRepo from "../repositories/fileRepo";
import { parseForRedis } from "../utils/excelUtils";

const getFile = async (fileTime: any) => {
  const data = await fileRepo.getFile(fileTime);
  return JSON.parse(data);
};

const updateFile = async (fileTime: any, filename: any) => {
  const worksheet = xlsx.parse(`${__dirname}/../uploads/${filename}`);
  const data = worksheet[Number(process.env.SHEET_NUM)].data;
  const newData = parseForRedis(data);
  // console.log(newData);

  return await fileRepo.updateFile(fileTime, newData);
};

export = { updateFile, getFile };
