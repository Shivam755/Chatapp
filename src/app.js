const express = require("express");
const app = express();
const { GetContainer } = require("./container");
const { GetPermissionRoutes } = require("./router/permission.route");

const configureExpressApp = async () => {
  const container = await GetContainer();
  const userController = container.resolve("userController");
  const permissionRouter = await GetPermissionRoutes();

  // adding middlewares
  app.use(express.json());
  // Parse URL-encoded bodies (form submissions)
  app.use(express.urlencoded({ extended: true }));

  // registering permission routes
  app.use("/permission", permissionRouter);

  app.get("/users", userController.getAllUsers);
  app.post("/registerUser", userController.registerUser);

  return app;
};

module.exports = { configureExpressApp };
