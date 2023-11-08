import { NextFunction, Request, Response } from "express";
import { EntityId } from "redis-om";
import classroomRepo from "../models/classroomModel";
import catchAsync from "../errors/catchAsync";
import AppError from "../errors/appError";
import { Classroom } from "../models/appTypes";

const getCr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const classroom = await classroomRepo.fetch(req.params.id);

    if (!classroom.classNum) {
      return next(new AppError("No classroom found with the given ID", 400));
    }
    classroom.id = classroom[EntityId];
    res.status(200).json({
      status: "success",
      data: classroom,
    });
  }
);

const getAllCr = catchAsync(async (req: Request, res: Response) => {
  const classrooms = await classroomRepo.search().return.all();
  res.status(200).json({
    status: "success",
    length: classrooms.length,
    data: classrooms,
  });
});

const postCr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new AppError("You didn't send data to save", 400));
    }

    if (!isClassroom(req.body)) {
      return next(new AppError("You did not provide a classroom", 400));
    }

    let classroom = await classroomRepo
      .search()
      .where("classNum")
      .equals(req.body.classNum)
      .return.first();

    if (classroom) {
      return next(
        new AppError("There is already a class with that number", 400)
      );
    }

    classroom = await classroomRepo.save(req.body);
    classroom.id = classroom[EntityId];
    res.status(201).json({
      status: "success",
      data: classroom,
    });
  }
);

const updateCr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new AppError("You didn't send data to save", 400));
    }

    const crFromDb = await classroomRepo.fetch(req.params.id);

    if (!crFromDb.classNum) {
      return next(new AppError("No classroom found with the given ID", 400));
    }

    if (!isClassroom(req.body)) {
      return next(new AppError("You did not provide a classroom", 400));
    }

    const updatedCr = await classroomRepo.save(req.params.id, req.body);
    updatedCr.id = updatedCr[EntityId];

    res.status(200).json({
      status: "success",
      data: updatedCr,
    });
  }
);

const deleteCr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const classroom = await classroomRepo.fetch(req.params.id);

    if (!classroom.classNum) {
      return next(new AppError("No classroom found with the given ID", 400));
    }

    await classroomRepo.remove(req.params.id);
    res.status(204).json({
      status: "success",
    });
  }
);

function isClassroom(obj: any): obj is Classroom {
  return (
    typeof obj === "object" &&
    "classNum" in obj &&
    "courseSet" in obj &&
    "camera" in obj &&
    "courseName" in obj &&
    "comment" in obj &&
    "time" in obj &&
    "completed" in obj
  );
}

export = { getCr, postCr, getAllCr, updateCr, deleteCr };
