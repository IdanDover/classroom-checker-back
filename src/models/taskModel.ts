import { Schema, Repository } from "redis-om";
import client from "../redis";

const taskSchema = new Schema("task", {
  taskNum: { type: "number" },
  courseSet: { type: "string" },
  description: { type: "string" },
  time: { type: "string" },
  completed: { type: "boolean" },
});

const taskRepo = new Repository(taskSchema, client);
taskRepo.createIndex();
export = taskRepo;
