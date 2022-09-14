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
    required: true
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
  // profilePicture: {
  //   type: String,
  //   default: 'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-male-circle-blue-512.png'
  // }
},
  {
    timestamps: true
  });

module.exports = model("User", userSchema);