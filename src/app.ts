import express, { Express } from "express";
const morgan = require("morgan");
import helmet from "helmet";
import classroomRouter from "./routes/classroomRouter";
import taskRouter from "./routes/taskRouter";
import specialRouter from "./routes/specialRouter";
import globalErrorHandler from "./errors/errorController";

//TODO: Add authentication
//TODO: improve the redis-om 

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.use(helmet());

const corsUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", corsUrl);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/v1/classroom", classroomRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1", specialRouter);

app.use(globalErrorHandler);

export = app;
