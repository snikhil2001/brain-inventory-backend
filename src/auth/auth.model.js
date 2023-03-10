const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
  password: String,
  googleId: String,
});

const User = mongoose.model("user", authSchema);

module.exports = User;
