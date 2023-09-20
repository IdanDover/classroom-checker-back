import client from "./redis";

const getFile = async (fileTime: string) => {
  const data = await client.getAsync(fileTime);
  console.log(data);

  return data;
};
const setFile = async (fileTime: string, data: any) => {
  return await client.setAsync(fileTime, "moshe");
};

export = { getFile, setFile };
