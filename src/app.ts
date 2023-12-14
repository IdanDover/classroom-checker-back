import express, { Express } from "express";
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
import helmet from "helmet";
import classroomRouter from "./routes/classroomRouter";
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";
import specialRouter from "./routes/specialRouter";
import globalErrorHandler from "./errors/errorController";
import AppError from "./errors/appError";

//TODO: make the email sender
//TODO: make it email to a user email to reset password
//TODO: change the models of user and classroom to make it easy to access the data

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.use(helmet());
app.use(cookieParser());

const corsUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", corsUrl);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use("/api/v1/classroom", classroomRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1", specialRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export = app;
