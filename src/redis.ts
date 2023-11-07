import { createClient } from "redis";

const password = process.env.REDIS_PASSWORD;
const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT);

const client = createClient({
  password,
  socket: {
    host,
    port,
  },
});

client.on("error", (err) => {
  throw new Error(err);
});

client.on("ready", () => {
  console.log("redis is ready");
});

client.connect();

export = client;
