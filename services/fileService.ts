import xlsx from "node-xlsx";
import fileRepo from "../repositories/fileRepo";

const updateFile = (fileTime: any, filename: any) => {
  const worksheet = xlsx.parse(`${__dirname}/../uploads/${filename}`);
  const data = worksheet[Number(process.env.SHEET_NUM)].data;
  return fileRepo.setFile(fileTime, data);
};

const getFile = async (fileTime: any) => {
  return await fileRepo.getFile(fileTime);
};

export = { updateFile, getFile };
