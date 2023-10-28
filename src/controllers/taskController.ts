import { Request, Response } from "express";
import { EntityId } from "redis-om";
import taskRepo from "../models/taskModel";

const getTask = async (req: Request, res: Response) => {
  const task = await taskRepo.fetch(req.params.id);
  task.id = task[EntityId];
  res.status(200).json({
    status: "success",
    data: task,
  });
};

const getAllTasks = async (req: Request, res: Response) => {
  const tasks = await taskRepo.search().return.all();
  res.status(200).json({
    status: "success",
    length: tasks.length,
    data: tasks,
  });
};

const postTask = async (req: Request, res: Response) => {
  const task = await taskRepo.save(req.body);
  task.id = task[EntityId];
  res.status(201).json({
    status: "success",
    data: task,
  });
};

export = { getTask, postTask, getAllTasks };
