const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient(6379, "127.0.0.1");

client.on("error", (err: any) => console.log("Redis Client Error", err));

client.on("connect", () => console.log("connected to redis"));

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);

export = client;
