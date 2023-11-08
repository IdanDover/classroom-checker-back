import { NextFunction, Request, Response } from "express";
import taskRepo from "../models/taskModel";
import crRepo from "../models/classroomModel";
import utilsForOren from "../utils/utilsForOren";
import AppError from "../errors/appError";
import catchAsync from "../errors/catchAsync";

const uploadForOren = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) {
      return next(
        new AppError("You need to send excel files with this route ", 400)
      );
    }

    const crIds = await crRepo.search().returnAllIds();

    const oldCrs = await crRepo
      .search()
      .where("time")
      .eq("evening")
      .return.all();

    crIds.forEach(async (id) => {
      await crRepo.remove(id);
    });

    const taskIds = await taskRepo.search().returnAllIds();

    taskIds.forEach(async (id) => {
      await taskRepo.remove(id);
    });

    oldCrs.forEach(async (cr) => {
      cr.time = "old";
      await crRepo.save(cr);
    });

    const { noonData, eveningData } = utilsForOren.parseFiles(req.files);

    noonData.classrooms.forEach(async (cr) => {
      await crRepo.save(cr);
    });

    eveningData.classrooms.forEach(async (cr) => {
      await crRepo.save(cr);
    });

    noonData.tasks.forEach(async (task) => {
      await taskRepo.save(task);
    });

    eveningData.tasks.forEach(async (task) => {
      await taskRepo.save(task);
    });

    res.json({
      status: "success",
      data: "Files upload success",
    });
  }
);

const deleteAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const crIds = await crRepo.search().returnAllIds();
    const taskIds = await taskRepo.search().returnAllIds();

    if (crIds.length === 0 && taskIds.length === 0) {
      return next(new AppError("nothing to delete", 400));
    }

    crIds.forEach(async (crId) => {
      await crRepo.remove(crId);
    });

    taskIds.forEach(async (taskId) => {
      await taskRepo.remove(taskId);
    });

    res.status(204).json();
  }
);

export = { uploadForOren, deleteAll };
