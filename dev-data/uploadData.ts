import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import userRepo from "../src/models/userModel";
import crRepo from "../src/models/classroomModel";
import taskRepo from "../src/models/taskModel";
import { Entity } from "redis-om";
import { createClient } from "redis";

const password = process.env.REDIS_PASSWORD;
const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT);

const client = createClient({
  password,
  socket: {
    host,
    port,
  },
});

client.on("close", () => {
  console.log("disconnected from redis");
});

const uploadUsers = () => {
  const data = fs.readFileSync(`${__dirname}/users.json`, "utf-8");
  const users = JSON.parse(data);
  const promises = users.map((user: Entity) => {
    userRepo.save(user);
  });

  return Promise.all(promises);
};

const uploadCrs = () => {
  const data = fs.readFileSync(`${__dirname}/classrooms.json`, "utf-8");
  const classrooms = JSON.parse(data);
  const promises = classrooms.map((cr: Entity) => {
    crRepo.save(cr);
  });

  return Promise.all(promises);
};

const uploadTasks = () => {
  const data = fs.readFileSync(`${__dirname}/tasks.json`, "utf-8");
  const tasks = JSON.parse(data);
  const promises = tasks.map((task: Entity) => {
    taskRepo.save(task);
  });

  return Promise.all(promises);
};

const deleteAll = async () => {
  const crIds = await crRepo.search().returnAllIds();
  const taskIds = await taskRepo.search().returnAllIds();
  const userIds = await userRepo.search().returnAllIds();

  const removeCrPromises = crIds.map((crId) => crRepo.remove(crId));
  const removeTaskPromises = taskIds.map((taskId) => taskRepo.remove(taskId));
  const removeUserPromises = userIds.map((userId) => userRepo.remove(userId));

  return Promise.all([
    ...removeCrPromises,
    ...removeTaskPromises,
    ...removeUserPromises,
  ]);
};

(async function () {
  try {
    await client.connect();
    await deleteAll();
    await uploadUsers();
    await uploadCrs();
    await uploadTasks();
    console.log("data is uploaded");
  } catch {
    console.error("There was a problem uploading the data");
  } finally {
    client.disconnect();
  }
})();
