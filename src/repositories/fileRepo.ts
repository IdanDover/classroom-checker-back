import client from "../redis";

const getFile = async (fileTime: string) => {
  return await client.get(fileTime);
};

const updateFile = async (fileTime: string, data: any) => {
  return await client.set(fileTime, data);
};

export = { getFile, updateFile };
