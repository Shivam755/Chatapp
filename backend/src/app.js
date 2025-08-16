const express = require("express");
const { GetContainer } = require("./container");
const { GetPermissionRoutes } = require("./router/permission.route");
const { GetRoleRoutes } = require("./router/role.route");

const configureExpressApp = async () => {
  const app = express();
  const container = await GetContainer();
  const userController = container.resolve("userController");
  const permissionRouter = await GetPermissionRoutes();
  const roleRouter = await GetRoleRoutes();

  // adding middlewares
  app.use(express.json());
  // Parse URL-encoded bodies (form submissions)
  app.use(express.urlencoded({ extended: true }));

  // registering permission routes
  app.use("/permission", permissionRouter);
  // registering role routes
  app.use("/role", roleRouter);

  app.get("/users", userController.getAllUsers);
  app.post("/registerUser", userController.registerUser);

  return app;
};

module.exports = { configureExpressApp };
