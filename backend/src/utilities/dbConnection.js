const mongoose = require("mongoose");

const loadMongoose = async () => {
  connString = process.env.MONGO_CONN_STRING || "";
  db = process.env.MONGO_DBNAME || "";
  uri = `${connString}/${db}`;
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, {
      retryWrites: true,
      writeConcern: { w: "majority" },
    });
    console.log("DB connection successfull");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB runtime error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
  });
  return mongoose;
};

const disConnectDB = async () => {
  console.log(`\nClosing MongoDB connection...`);
  await mongoose.disconnect();
  console.log("MongoDB connection closed.");
};

module.exports = { loadMongoose, disConnectDB };
