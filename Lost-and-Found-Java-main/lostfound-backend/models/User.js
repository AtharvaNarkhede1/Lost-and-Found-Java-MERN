const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  email: { type: String, required: true },   // Make required if you want
  phone: { type: String },
  registrationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);