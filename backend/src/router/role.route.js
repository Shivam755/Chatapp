const router = require("express").Router();
const { GetContainer } = require("../container");

const GetRoleRoutes = async () => {
  const container = await GetContainer();
  const roleController = container.resolve("roleController");
  router.get("/", roleController.getAllRole);
  router.post("/", roleController.addRole);
  return router;
};

module.exports = { GetRoleRoutes };
