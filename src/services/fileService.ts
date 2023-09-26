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
  removeFileFromUploads(filename);

  return await fileRepo.updateFile(fileTime, newData);
};

const updateFiles = async (files: any) => {
  const noonWorksheet = xlsx.parse(
    `${__dirname}/../../uploads/${files.noon[0].filename}`
  );
  const eveningWorksheet = xlsx.parse(
    `${__dirname}/../../uploads/${files.evening[0].filename}`
  );

  const oldData = await fileRepo.getFile("evening");

  const noonData = parseForRedis(
    noonWorksheet[Number(process.env.SHEET_NUM)].data
  );

  const eveningData = parseForRedis(
    eveningWorksheet[Number(process.env.SHEET_NUM)].data
  );

  const noonResponse = await fileRepo.updateFile("noon", noonData);
  const eveningResponse = await fileRepo.updateFile("evening", eveningData);

  if (noonResponse !== "OK" || eveningResponse !== "OK") {
    throw new Error("problem saving files");
  }
  console.log(oldData);

  const oldResponse = await fileRepo.updateFile("old", oldData);

  if (oldResponse !== "OK") {
    throw new Error("problem saving old file");
  }

  removeFileFromUploads(files.noon[0].filename);
  removeFileFromUploads(files.evening[0].filename);

  return "OK";
};

const removeFileFromUploads = (fileName: any) => {
  fs.unlink(`${__dirname}/../../uploads/${fileName}`, (err) => {
    if (err) {
      console.log("error deleting file: ", err);
    }
  });
};

export = { updateFile, getFile, updateFiles };
