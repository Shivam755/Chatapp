const router = require("express").Router();
const { GetContainer } = require("../container");

const GetPermissionRoutes = async () => {
  const container = await GetContainer();
  const permissionController = container.resolve("permissionController");
  const authMiddleware = container.resolve("authMiddleware");
  router.get("/", authMiddleware.verifyToken, authMiddleware.requireRole("admin"), permissionController.getAllPermission);
  router.post("/", authMiddleware.verifyToken, authMiddleware.requireRole("admin"), permissionController.addPermission);
  return router;
};

module.exports = { GetPermissionRoutes };
