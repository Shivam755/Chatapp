const router = require("express").Router();
const { GetContainer } = require("../container");

const GetUserRoutes = async () => {
  const container = await GetContainer();
  const userController = container.resolve("userController");
  const authMiddleware = container.resolve("authMiddleware");

  router.post("/signup", userController.registerUser);
  router.post("/login", userController.loginUser);
  router.delete(
    "/logout",
    authMiddleware.verifyToken,
    authMiddleware.requireRole("user"),
    userController.logout
  );
  router.get(
    "/all",
    authMiddleware.verifyToken,
    authMiddleware.requireRole("admin"),
    userController.getAllUsers
  );
  router.get(
    "/",
    authMiddleware.verifyToken,
    authMiddleware.requireRole("user"),
    userController.getUserInfo
  );
  router.get(
    "/isLoggedIn",
    authMiddleware.verifyToken,
    authMiddleware.requireRole("user"),
    userController.isLoggedIn
  );

  return router;
};

module.exports = { GetUserRoutes };
