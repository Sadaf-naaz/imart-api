const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {type: String},
        size: { type: String, default:"S"},
        color: { type: String, default:"red" },
        quantity: {type: Number,default: 1,},
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);