const redis = require("redis");

const getRedisClient = async () => {
  const client = redis.createClient({
    url: process.env.REDIS_CONN_STRING || "redis://localhost:6379",
  });
  client.on("error", (err) => console.error("Redis Client Error", err));
  await client.connect();

  return client;
};

const disconnectRedis = async (client) => {
  if (client) {
    console.log("Disconnecting Redis client...");
    await client.quit();
    client = null;
  }
};


module.exports = { getRedisClient, disconnectRedis };
