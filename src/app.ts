import express, { Express, Request, Response } from "express";
import classroomRouter from "./routes/classroomRouter";
import taskRouter from "./routes/taskRouter";
import specialRouter from "./routes/specialRouter";

//TODO: Add the ability to get via query params
//TODO: Add error handling
//TODO: Add authentication
//TODO: change the functions to a middleware for oren special use case

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/classroom", classroomRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1", specialRouter);

export = app;
