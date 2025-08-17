const { configureExpressApp } = require("./app");
const { disConnectDB } = require("./utilities/dbConnection");
const { setupGracefulShutdown } = require("./utilities/gracefulShutDown");


require("dotenv").config();

const main = async () => {
  const app = await configureExpressApp();
  port = process.env.SERVER_PORT || 3000;
  app.listen(port, () => {
    console.log("Express server is running on port: " + port);
    return "Express is running";
  });

  setupGracefulShutdown([disConnectDB], []);
};

main().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
