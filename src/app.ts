import express, { Express } from "express";
const morgan = require("morgan");
import helmet from "helmet";
import classroomRouter from "./routes/classroomRouter";
import taskRouter from "./routes/taskRouter";
import specialRouter from "./routes/specialRouter";
import globalErrorHandler from "./errors/errorController";

//TODO: Add authentication
//TODO: check where you can use Promise.all

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.use(helmet());

app.use("/api/v1/classroom", classroomRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1", specialRouter);

app.use(globalErrorHandler);

export = app;
