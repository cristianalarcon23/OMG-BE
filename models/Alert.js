const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const alertSchema = new Schema({
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
      },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
},
  {
    timestamps: true
  });

module.exports = model("Alert", alertSchema);