// models/User.js
const mongoose = require("mongoose");

getPermissionModel = () => {
  const permSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "post:create"
  });
  return mongoose.model("Permission", permSchema);
};

module.exports = getPermissionModel;
