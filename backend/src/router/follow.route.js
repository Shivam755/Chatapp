const router = require("express").Router();
const { GetContainer } = require("../container");

const GetFollowRoutes = async () => {
  const container = await GetContainer();
  const followController = container.resolve("followController");
  const authMiddleware = container.resolve("authMiddleware");

  // register routes here
  router.get(
    "/followers",
    authMiddleware.verifyToken,
    authMiddleware.requireRole("user"),
    followController.fetchAllFollowers
  );
  router.get(
    "/following",
    authMiddleware.verifyToken,
    authMiddleware.requireRole("user"),
    followController.fetchAllFollowing
  );
  return router;
};

module.exports = { GetFollowRoutes };
