const mongoose = require("mongoose");

getUserModel = () => {
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      role: { type: String, required: true },
    },
    { timestamps: true }
  );
  return mongoose.model("User", userSchema);
};
module.exports = getUserModel;
