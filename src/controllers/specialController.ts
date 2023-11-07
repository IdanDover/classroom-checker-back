import { Request, Response } from "express";
import taskRepo from "../models/taskModel";
import crRepo from "../models/classroomModel";
import utilsForOren from "../utils/utilsForOren";

const uploadForOren = async (req: Request, res: Response) => {
  if (!req.files) {
    return;
  }

  const crIds = await crRepo.search().returnAllIds();

  const oldCrs = await crRepo.search().where("time").eq("evening").return.all();

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
};

const deleteAll = async (req: Request, res: Response) => {
  const crIds = await crRepo.search().returnAllIds();
  const taskIds = await taskRepo.search().returnAllIds();

  crIds.forEach(async (crId) => {
    await crRepo.remove(crId);
  });

  taskIds.forEach(async (taskId) => {
    await taskRepo.remove(taskId);
  });

  res.status(204).json();
};

export = { uploadForOren, deleteAll };
