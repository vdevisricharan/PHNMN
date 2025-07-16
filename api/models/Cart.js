const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
    trim: true,
  },
  products: [
    {
      productId: {
        type: String,
        required: [true, "Product ID is required"],
        trim: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, "Quantity must be at least 1"],
      },
    },
  ],
}, { timestamps: true });

CartSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    next(new Error('Cart validation failed.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Cart", CartSchema);