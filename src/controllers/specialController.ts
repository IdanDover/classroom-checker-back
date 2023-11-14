import { NextFunction, Request, Response } from "express";
import taskRepo from "../models/taskModel";
import crRepo from "../models/classroomModel";
import utilsForOren from "../utils/utilsForOren";
import AppError from "../errors/appError";
import catchAsync from "../errors/catchAsync";
import ApiFeatures from "../utils/apiFeatures";
import { EntityId } from "redis-om";

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

    const taskIds = await taskRepo.search().returnAllIds();

    const removeCrPromises = crIds.map((id) => {
      crRepo.remove(id);
    });

    const removeTaskPromises = taskIds.map((id) => {
      taskRepo.remove(id);
    });

    const saveOldCrPromises = oldCrs.map((cr) => {
      cr.time = "old";
      crRepo.save(cr);
    });

    await Promise.all([
      ...removeCrPromises,
      ...removeTaskPromises,
      ...saveOldCrPromises,
    ]);

    const { noonData, eveningData } = utilsForOren.parseFiles(req.files);

    const saveNoonCrPromises = noonData.classrooms.map((cr) => {
      crRepo.save(cr);
    });

    const saveEveningCrPromises = eveningData.classrooms.map((cr) => {
      crRepo.save(cr);
    });

    const saveNoonTaskPromises = noonData.tasks.map((task) => {
      taskRepo.save(task);
    });

    const saveEveningTaskPromises = eveningData.tasks.map((task) => {
      taskRepo.save(task);
    });

    await Promise.all([
      ...saveNoonCrPromises,
      ...saveEveningCrPromises,
      ...saveNoonTaskPromises,
      ...saveEveningTaskPromises,
    ]);

    res.json({
      status: "success",
      data: "Files upload success",
    });
  }
);

const getFloors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const classrooms = await new ApiFeatures(crRepo, req.query)
      .filter()
      .sort()
      .returnAll().promise;
    const floors: any = {};
    const floorNumbers: Array<number> = [];

    classrooms.forEach((cr) => {
      if (typeof cr.classNum !== "number") {
        return;
      }
      const floorNum = Math.floor(cr.classNum / 100);
      if (!floors[`floor-${floorNum}`]) {
        floorNumbers.push(floorNum);
        floors[`floor-${floorNum}`] = [];
      }

      cr.id = cr[EntityId];

      floors[`floor-${floorNum}`].push(cr);
    });

    res.status(200).json({
      status: "success",
      data: { floorNumbers, floors },
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

    const removeCrPromises = crIds.map((crId) => crRepo.remove(crId));
    const removeTaskPromises = taskIds.map((taskId) => taskRepo.remove(taskId));

    await Promise.all([...removeCrPromises, ...removeTaskPromises]);

    res.status(204).json();
  }
);

export = { uploadForOren, getFloors, deleteAll };
