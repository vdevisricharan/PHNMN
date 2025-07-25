const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  type: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  locality: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: String,
  color: String,
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const walletTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const pointsTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['earned', 'redeemed'], required: true },
  points: { type: Number, required: true },
  description: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  
  // Profile Status
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
  
  // Payment & Rewards
  stripeCustomerId: String,
  walletBalance: { type: Number, default: 0 },
  walletTransactions: [walletTransactionSchema],
  pointsBalance: { type: Number, default: 0 },
  pointsTransactions: [pointsTransactionSchema],
  
  // Shopping Data
  cart: [cartItemSchema],
  wishlist: [wishlistItemSchema],
  addresses: [addressSchema],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
