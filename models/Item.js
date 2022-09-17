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
  newItem: {
    type: String,
    default: 'Yes'
  },
  type: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true
  },
  imageUrls: {
    type: [String],
    required: true
  },
  transactionToken: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  previousOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true
  });

module.exports = model("Item", itemSchema);