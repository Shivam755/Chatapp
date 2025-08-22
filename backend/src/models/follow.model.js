// models/User.js
const mongoose = require("mongoose");

getFollowModel = () => {
  const followSchema = new mongoose.Schema({
    followerId: { type: mongoose.Types.ObjectId, required: true, unique: true },
    followingId: { type: mongoose.Types.ObjectId, required: true, unique: true },
  },
  { timestamps: true }
);
  return mongoose.model("Follow", followSchema);
};

module.exports = getFollowModel;
