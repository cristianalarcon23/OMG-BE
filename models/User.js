const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  idNumber: {
    type: String,
    unique: true,
    required: true
  },
  telephone: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  });

module.exports = model("User", userSchema);