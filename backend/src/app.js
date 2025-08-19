const express = require("express");
const cors = require("cors");
const { GetContainer } = require("./container");
const { GetPermissionRoutes } = require("./router/permission.route");
const { GetRoleRoutes } = require("./router/role.route");
const { disConnectDB } = require("./utilities/dbConnection");
const { setupGracefulShutdown } = require("./utilities/gracefulShutDown");
const { disconnectRedis } = require("./utilities/RedisConnection");

const configureExpressApp = async () => {
  const app = express();
  const container = await GetContainer();
  const defaultValues = container.resolve("dbValueInsertOnCreation");
  const redisClient = container.resolve("redisClient");
  // Insert default values into the database
  await defaultValues.insertDefaultValues();

  const userController = container.resolve("userController");
  const permissionRouter = await GetPermissionRoutes();
  const roleRouter = await GetRoleRoutes();

  // adding middlewares
  app.use(express.json());
  // Parse URL-encoded bodies (form submissions)
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:3001", // only allow requests from this origin
    })
  );

  // registering permission routes
  app.use("/permission", permissionRouter);
  // registering role routes
  app.use("/role", roleRouter);

  app.get("/users", userController.getAllUsers);
  app.post("/signup", userController.registerUser);
  app.post("/login", userController.loginUser);
  // app.post("/decrypt", userController.decrypt);

  setupGracefulShutdown([{
    fn:disConnectDB,
    args: []
  },
  {
    fn: disconnectRedis,
    args: [redisClient]}    
], []);

  return app;
};

module.exports = { configureExpressApp };
