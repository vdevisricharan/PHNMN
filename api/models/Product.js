const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
    minlength: [2, "Title must be at least 2 characters"],
    maxlength: [100, "Title must be less than 100 characters"],
  },
  desc: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description too long"],
  },
  img: {
    type: String,
    required: [true, "Image URL is required"],
    trim: true,
  },
  categories: {
    type: [String],
    default: [],
  },
  size: {
    type: [String],
    default: [],
  },
  color: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.index({ title: 1, color: 1 }, { unique: true });

ProductSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate product title entered.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Product", ProductSchema);