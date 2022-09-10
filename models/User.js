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
  }, 
  profilePicture: {
    type: String,
    default: "https://us.123rf.com/450wm/tuktukdesign/https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1608/tuktukdesign160800043/61010830-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-ilustraci%C3%B3n-vectorial-persona-glifo.jpg?ver=6/tuktukdesign160800043/61010830-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-ilustraci%C3%B3n-vectorial-persona-glifo.jpg?ver=6"
  }
},
  {
    timestamps: true
  });

module.exports = model("User", userSchema);