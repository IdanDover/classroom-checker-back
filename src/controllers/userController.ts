import { Request, Response, NextFunction } from "express";
import catchAsync from "../errors/catchAsync";
import userRepo from "../models/userModel";
import { EntityId } from "redis-om";
import AppError from "../errors/appError";

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.locals.user.password = undefined;
    res.status(200).json({ status: "success", data: res.locals.user });
  }
);

const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (req.body.email || req.body.password) {
      return next(new AppError("You can't update your email or password", 400));
    }

    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return next(new AppError("You did not provide the data to update", 400));
    }

    user.firstName = firstName;
    user.lastName = lastName;
    await userRepo.save(user[EntityId], user);
    user.password = undefined;
    res.status(200).json({ status: "success", data: user });
  }
);

const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await userRepo.remove(res.locals.user[EntityId]);

    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(204).json();
  }
);

const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    console.log(user);
    console.log(req.body);

    if (user.password !== req.body.currentPassword) {
      return next(new AppError("Your current password is wrong", 401));
    }

    user.password = req.body.newPassword;
    await userRepo.save(user[EntityId], user);

    res.status(200).json({ status: "success", data: user });
  }
);

export = { getMe, updateMe, deleteMe, updatePassword };
