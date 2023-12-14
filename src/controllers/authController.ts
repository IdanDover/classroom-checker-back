const { promisify } = require("util");
const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import userRepo from "../models/userModel";
import AppError from "../errors/appError";
import catchAsync from "../errors/catchAsync";
import { Roles, User } from "../models/appTypes";
import { EntityId } from "redis-om";

const signToken = (id: string | undefined, expiresIn?: number) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn ?? process.env.JWT_EXPIRES_IN,
  });

const createAndSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user[EntityId]);

  const tokenTimeToExpire = Number(process.env.JWT_COOKIE_EXPIRES_IN);

  const maxAge = tokenTimeToExpire * 24 * 60 * 60 * 1000;
  const cookieOptions = {
    maxAge,
    httpOnly: true,
    secure: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new AppError("You didn't send data to save", 400));
    }

    if (!isUser(req.body)) {
      return next(new AppError("You did not provide a user", 400));
    }

    let user = await userRepo
      .search()
      .where("email")
      .equals(req.body.email)
      .return.first();

    if (user) {
      return next(new AppError("There is already a user with that email", 400));
    }

    user = await userRepo.save(req.body);
    user.id = user[EntityId];

    createAndSendToken(user as User, 201, res);
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //1)check if email and password exists
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    //2)check if user exists && password is correct
    const user = await userRepo
      .search()
      .where("email")
      .equals(email)
      .and("password")
      .equals(password)
      .return.first();

    if (!user) {
      return next(new AppError("Incorrect email or password", 401));
    }

    //3)if everything is ok, send token to client
    createAndSendToken(user as User, 200, res);
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({ status: "success" });
  }
);

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! please log in to get access", 401)
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await userRepo.fetch(decoded.id);
    if (!isUser(currentUser)) {
      return next(
        new AppError(
          "The user belonging to the token does no longer exists",
          401
        )
      );
    }

    res.locals.user = currentUser;
    next();
  }
);

const restrictTo =
  (...roles: Array<Roles>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(
        new AppError("You don't have permission to preform this action", 403)
      );
    }

    next();
  };

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await userRepo.fetch(decoded.id);
      if (!currentUser) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepo
      .search()
      .where("email")
      .equals(req.body.email)
      .return.first();

    if (!user) {
      return next(
        new AppError("There is no user with this email address", 404)
      );
    }

    const resetToken = signToken(req.body.email, Date.now() + 1000 * 60 * 10);

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PUT request with your new password to: ${resetURL}. This url will be valid for 10 minutes.\nIf you didn't forget your password, please ignore this email`;

    res.status(200).json({
      status: "success",
      data: message,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = await promisify(jwt.verify)(
      req.params.token,
      process.env.JWT_SECRET
    );

    const user = await userRepo
      .search()
      .where("email")
      .equals(decoded.id)
      .returnFirst();

    if (!user) {
      return next(new AppError("The user does not exist", 401));
    }

    user.password = req.body.password;
    await userRepo.save(user[EntityId] as string, user);

    createAndSendToken(user as User, 200, res);
  }
);

function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    "firstName" in obj &&
    "lastName" in obj &&
    "email" in obj &&
    "password" in obj &&
    "role" in obj
  );
}

export = {
  signup,
  login,
  logout,
  protect,
  isLoggedIn,
  restrictTo,
  forgotPassword,
  resetPassword,
};
