const router = require("express").Router();
const { GetContainer } = require("../container");

const GetRoleRoutes = async () => {
  const container = await GetContainer();
  const roleController = container.resolve("roleController");
  const authMiddleware = container.resolve("authMiddleware");
  router.get("/", authMiddleware.verifyToken, authMiddleware.requireRole("admin"), roleController.getAllRole);
  router.post("/", authMiddleware.verifyToken, authMiddleware.requireRole("admin"), roleController.addRole);
  return router;
};

module.exports = { GetRoleRoutes };
