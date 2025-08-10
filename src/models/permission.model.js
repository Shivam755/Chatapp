// models/User.js
const mongoose = require("mongoose");

const permSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "post:create"
});
module.exports = { Permission: mongoose.model("Permission", permSchema) };
