const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  isNew: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true
  },
  itemPicture: {
    type: String,
    required: true
  },
  snPicture: {
    type: String,
    required: true
  },
  warrantyPicture: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true
  });

module.exports = model("Item", itemSchema);