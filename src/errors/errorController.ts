import { NextFunction, Request, Response } from "express";
import AppError from "./appError";

const handleJWTError = () => new AppError("Invalid token. Please log in", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in", 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
};

// const sendErrorProd = (err: AppError, req: Request, res: Response) => {
//   if (req.originalUrl.startsWith("/api")) {
//     if (err.isOperational) {
//       res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     } else {
//       //log error
//       // eslint-disable-next-line no-console
//       console.error("ERROR 💥:", err);

//       //Send generic message
//       res.status(500).json({
//         status: "fail",
//         msg: "Something went very wrong",
//       });
//     }
//   } else if (err.isOperational) {
//     res.status(err.statusCode).render("error", {
//       title: "Something went wrong",
//       msg: err.message,
//     });
//   } else {
//     //log error
//     // eslint-disable-next-line no-console
//     console.error("ERROR 💥:", err);

//     //Send generic message
//     res.status(err.statusCode).render("error", {
//       title: "Something went wrong",
//       msg: "Something went very wrong",
//     });
//   }
// };

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  sendErrorDev(err, req, res);
  //   if (process.env.NODE_ENV === "development") {
  //   } else if (process.env.NODE_ENV === "production") {
  //     let error = { ...err };
  //     error.message = err.message;

  //     if (err.name === "CastError") {
  //       error = handleCastErrorDB(error);
  //     }
  //     if (err.code === 11000) {
  //       error = handleDuplicateFieldDB(error);
  //     }
  //     if (err.name === "ValidationError") {
  //       error = handleValidationErrorDB(error);
  //     }
  //     if (err.name === "JsonWebTokenError") {
  //       error = handleJWTError();
  //     }
  //     if (err.name === "TokenExpiredError") {
  //       error = handleJWTExpiredError();
  //     }

  //     sendErrorProd(error, req, res);
  //   }
  next();
};

export = globalErrorHandler;
