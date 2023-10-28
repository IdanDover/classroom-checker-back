import { Request, Response } from "express";
import { EntityId } from "redis-om";
import classroomRepo from "../models/classroomModel";

const getCr = async (req: Request, res: Response) => {
  const classroom = await classroomRepo.fetch(req.params.id);
  classroom.id = classroom[EntityId];
  res.status(200).json({
    status: "success",
    data: classroom,
  });
};

const getAllCr = async (req: Request, res: Response) => {
  const classrooms = await classroomRepo.search().return.all();
  res.status(200).json({
    status: "success",
    length: classrooms.length,
    data: classrooms,
  });
};

const postCr = async (req: Request, res: Response) => {
  const classroom = await classroomRepo.save(req.body);
  classroom.id = classroom[EntityId];
  res.status(201).json({
    status: "success",
    data: classroom,
  });
};

const deleteCr = async (req: Request, res: Response) => {
  await classroomRepo.remove(req.params.id);
  res.status(204).json({
    status: "success",
  });
};

export = { getCr, postCr, getAllCr, deleteCr };
