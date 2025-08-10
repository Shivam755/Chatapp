const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }], // store permission names
});
module.exports = { Role: mongoose.model("Role", roleSchema) };
