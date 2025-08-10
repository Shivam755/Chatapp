const mongoose = require("mongoose");

const loadMongoose = async () => {
  ip = process.env.MONGO_IP || "localhost";
  port = process.env.MONGO_PORT || 27017;
  db = process.env.MONGO_DBNAME || "ChatApp";
  uri = `mongodb://${ip}:${port}/${db}`;

  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

module.exports = { loadMongoose };
