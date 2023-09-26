import express, { Express, Request, Response } from "express";

import fileRouter from "./routes/fileRouter";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/v1/file", fileRouter);

export = app;
