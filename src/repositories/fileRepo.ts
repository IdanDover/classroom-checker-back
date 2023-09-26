import client from "./redis";

const getFile = async (fileTime: string) => {
  return await client.getAsync(fileTime);
};

const updateFile = async (fileTime: string, data: any) => {
  return await client.setAsync(fileTime, data);
};

export = { getFile, updateFile };
