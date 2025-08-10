const { configureExpressApp } = require("./app");
const { gracefulShutdown } = require("./repositories/dbConnection");
require("dotenv").config();

const main = async () => {
  const app = await configureExpressApp();
  port = process.env.SERVER_PORT || 3000;
  // Handle app termination signals
  process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Kill command
  process.on("exit", () => gracefulShutdown("exit"));
  app.listen(port, () => {
    console.log("Express server is running on port: " + port);
    return "Express is running";
  });
};

main().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
