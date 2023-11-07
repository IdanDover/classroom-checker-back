import { NextFunction, Request, Response } from "express";
import fs from "fs";
import crRepo from "../src/models/classroomModel";
import taskRepo from "../src/models/taskModel";
import { Entity } from "redis-om";

const uploadCrs = (req: Request, res: Response, next: NextFunction) => {
  const data = fs.readFileSync(`${__dirname}/classrooms.json`, "utf-8");
  const classrooms = JSON.parse(data);
  classrooms.forEach((cr: Entity) => {
    crRepo.save(cr);
  });
  next();
};

const uploadTasks = (req: Request, res: Response, next: NextFunction) => {
  const data = fs.readFileSync(`${__dirname}/tasks.json`, "utf-8");
  const tasks = JSON.parse(data);
  tasks.forEach((task: Entity) => {
    taskRepo.save(task);
  });

  res.json({
    status: "success",
    data: "uploaded data success",
  });
};

export = { uploadCrs, uploadTasks };
