import express, { Express, Request, Response } from "express";

import excel from "./excelParser";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

export = app;
