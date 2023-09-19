import dotenv from "dotenv";
import app from "./app";
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(`${err.name} : ${err.message}`);
  console.log("UNCAUGHT EXCEPTION 💥 Shutting down...");
  process.exit(1);
});

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`⚡️Server is running on port:${port}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(`Error name-${err.name} :Error message-${err.message}`);
  console.log("UNHANDLER REJECTION 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
