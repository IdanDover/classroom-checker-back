import express, { Express, Request, Response } from "express";
import fileRouter from "./routes/fileRouter";
import classroomRouter from "./routes/classroomRouter";
import taskRouter from "./routes/taskRouter";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//NOTE:Delete this middleware after use
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/v1/file", fileRouter);
app.use("/api/v1/classroom", classroomRouter);
app.use("/api/v1/task", taskRouter);

export = app;
