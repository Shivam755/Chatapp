const express = require("express");
const app = express();
const { CreateContainer } = require("./container");

const configureExpressApp = async () => {
  const container = await CreateContainer();
  const userController = container.resolve("userController");

  app.get("/users", userController.getAllUsers);
  return app;
};

module.exports = { configureExpressApp };
