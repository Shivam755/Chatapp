const { configureExpressApp } = require("./app");


require("dotenv").config();

const main = async () => {
  const app = await configureExpressApp();
  port = process.env.SERVER_PORT || 3000;
  app.listen(port, () => {
    console.log("Express server is running on port: " + port);
    return "Express is running";
  });
};

main().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
