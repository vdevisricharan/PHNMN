
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be positive"],
  },
  address: {
    type: Object,
    required: [true, "Address is required"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
  },
}, { timestamps: true });

OrderSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    next(new Error('Order validation failed.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Order", OrderSchema);
