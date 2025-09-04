const mongoose = require("mongoose");

getUserModel = () => {
  const userSchema = new mongoose.Schema(
    {
      profileImage: {type:String, required: true, default: process.env.DEFAULT_USER_ICON_URL},
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      role: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Role" },
    },
    { timestamps: true }
  );
  return mongoose.model("User", userSchema);
};
module.exports = getUserModel;
