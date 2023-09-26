import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.on("ready", () => console.log("redis is ready"));

client.connect();

export = client;
