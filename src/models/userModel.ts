import { Schema, Repository } from "redis-om";
import client from "../redis";

const userSchema = new Schema("task", {
  firstName: { type: "string" },
  lastName: { type: "string" },
  email: { type: "string" },
  password: { type: "string" },
  role: { type: "string" },
});

const userRepo = new Repository(userSchema, client);
userRepo.createIndex();
export = userRepo;
