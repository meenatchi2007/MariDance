const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", signupSchema);
