const { promisify } = require("util");
const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import userRepo from "../models/userModel";
import AppError from "../errors/appError";
import catchAsync from "../errors/catchAsync";
import { Roles, User } from "../models/appTypes";
import { EntityId } from "redis-om";

const signToken = (id: string | undefined) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
    //1) getting token and check if it's there
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

    //2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) check if user still exists
    const currentUser = await userRepo.fetch(decoded.id);
    if (!currentUser) {
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

export = { signup, login, logout, protect, isLoggedIn, restrictTo };

// exports.forgotPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     //1)Get user based on email
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return next(
//         new AppError("There is no user with this email address", 404)
//       );
//     }

//     //2)Generate the random reset token
//     const resetToken = user.createPasswordResetToken();
//     await user.save({ validateBeforeSave: false });

//     //3)Send email to user
//     const resetURL = `${req.protocol}://${req.get(
//       "host"
//     )}/api/v1/users/resetPassword/${resetToken}`;

//     const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

//     try {
//       await sendEmail({
//         email: user.email,
//         subject: "Your password reset token(valid for 10 minutes)",
//         message,
//       });

//       res.status(200).json({
//         status: "success",
//         message: "Token sent to email",
//       });
//     } catch (err) {
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save({ validateBeforeSave: false });

//       return next(
//         new AppError(
//           "There was an error sending the email. Please try again later",
//           500
//         )
//       );
//     }
//   }
// );

// exports.resetPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     //1)Get user based on the token
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passwordResetExpires: { $gt: Date.now() },
//     });

//     //2)If token has not expired, and there is user, set the new user
//     if (!user) {
//       return next(new AppError("Token is invalid or has expired", 400));
//     }

//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;

//     await user.save();

//     //3)Update changedPassword property for the user

//     //4)Log the user in, send JWT
//     createAndSendToken(user, 200, res);
//   }
// );

// exports.updatePassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     //1)Get user from collection
//     const user = await User.findById(req.user.id).select("+password");

//     //2)Check if posted password is correct
//     if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
//       return next(new AppError("Your current password is wrong", 401));
//     }

//     //3)If so, update password
//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;
//     await user.save();

//     //4)Log user in, send JWT
//     createAndSendToken(user, 200, res);
//   }
// );
