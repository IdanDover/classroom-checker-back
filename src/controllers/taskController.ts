import { NextFunction, Request, Response } from "express";
import { EntityId } from "redis-om";
import taskRepo from "../models/taskModel";
import catchAsync from "../errors/catchAsync";
import AppError from "../errors/appError";
import { Task } from "../models/appTypes";

const getTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await taskRepo.fetch(req.params.id);
    if (!task.taskNum) {
      return next(new AppError("No task found with the given ID", 400));
    }

    task.id = task[EntityId];
    res.status(200).json({
      status: "success",
      data: task,
    });
  }
);

const getAllTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await taskRepo.search().return.all();
    res.status(200).json({
      status: "success",
      length: tasks.length,
      data: tasks,
    });
  }
);

const postTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new AppError("You didn't send data to save", 400));
    }

    if (!isTask(req.body)) {
      return next(
        new AppError(
          "Yod didn't provide a task, please provide the correct data",
          400
        )
      );
    }

    const task = await taskRepo.save(req.body);
    task.id = task[EntityId];
    res.status(201).json({
      status: "success",
      data: task,
    });
  }
);

const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new AppError("You didn't send data to save", 400));
    }

    const taskFromDb = (await taskRepo.fetch(req.params.id)) as Task;

    if (!taskFromDb.taskNum) {
      return next(new AppError("No task found with the given ID", 400));
    }

    if (!isTask(req.body)) {
      return next(new AppError("Yod didn't provide a task", 400));
    }

    const updatedTask = await taskRepo.save(req.params.id, req.body);
    updatedTask.id = updatedTask[EntityId];

    const task = await taskRepo.save(req.body);
    task.id = task[EntityId];
    res.status(201).json({
      status: "success",
      data: updatedTask,
    });
  }
);

const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await taskRepo.fetch(req.params.id);

    if (!task.taskNum) {
      return next(new AppError("No task found with the given ID", 400));
    }

    await taskRepo.remove(req.params.id);
    res.status(204).json({
      status: "success",
    });
  }
);

function isTask(obj: any): obj is Task {
  return (
    typeof obj === "object" &&
    "taskNum" in obj &&
    "courseSet" in obj &&
    "description" in obj &&
    "time" in obj &&
    "completed" in obj
  );
}

export = { getTask, postTask, updateTask, getAllTasks, deleteTask };
