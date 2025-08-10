const router = require("express").Router();
const { GetContainer } = require("../container");

const GetPermissionRoutes = async () => {
  const container = await GetContainer();
  const permissionController = container.resolve("permissionController");
  router.get("/", permissionController.getAllPermission);
  router.post("/", permissionController.addPermission);
  return router;
};

module.exports = { GetPermissionRoutes };
