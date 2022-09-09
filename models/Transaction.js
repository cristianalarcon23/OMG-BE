const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const transactionSchema = new Schema({
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
      },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
},
  {
    timestamps: true
  });

module.exports = model("Transaction", transactionSchema);