import { Schema, Repository } from "redis-om";
import client from "../redis";

const classroomSchema = new Schema("classroom", {
  classNum: { type: "number", sortable: true },
  courseSet: { type: "string" },
  camera: { type: "string" },
  courseName: { type: "string" },
  comment: { type: "string" },
  time: { type: "string" },
  completed: { type: "boolean" },
});

const crRepo = new Repository(classroomSchema, client);
crRepo.createIndex();

export = crRepo;
