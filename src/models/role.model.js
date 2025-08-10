const mongoose = require("mongoose");

getRoleModel = () => {
  const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }], // store permission names
  });
  return mongoose.model("Role", roleSchema);
};

module.exports = getRoleModel;
