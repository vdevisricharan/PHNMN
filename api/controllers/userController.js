const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Auth & Profile
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, phone, dateOfBirth });
    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -walletTransactions -pointsTransactions');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, dateOfBirth },
      { new: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Wallet
exports.getWalletDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance');
    res.json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addWalletMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    user.walletBalance += amount;
    user.walletTransactions.push({
      type: 'credit',
      amount,
      description: 'Added money to wallet'
    });

    await user.save();
    res.json({ balance: user.walletBalance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getWalletTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user.id).select('walletTransactions');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Paginate walletTransactions array manually
    const total = user.walletTransactions.length;
    const transactions = user.walletTransactions
      .slice(skip, skip + limit);

    res.json({
      transactions,
      page,
      limit,
      total,
      hasMore: skip + limit < total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Points
exports.getPointsDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('pointsBalance');
    res.json({ points: user.pointsBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.redeemPoints = async (req, res) => {
  try {
    const { points, rewardId } = req.body;
    const user = await User.findById(req.user.id);

    if (user.pointsBalance < points) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    user.pointsBalance -= points;
    user.pointsTransactions.push({
      type: 'redeemed',
      points,
      description: 'Redeemed points for reward'
    });

    await user.save();
    res.json({ points: user.pointsBalance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPointsTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user.id).select('pointsTransactions');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Paginate pointsTransactions array manually
    const total = user.pointsTransactions.length;
    const transactions = user.pointsTransactions
      .slice(skip, skip + limit);

    res.json({
      transactions,
      page,
      limit,
      total,
      hasMore: skip + limit < total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity } = req.body;
    const user = await User.findById(req.user.id);

    const existing = user.cart.find(
      item => item.productId.equals(productId) && item.size === size && item.color === color
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ productId, size, color, quantity, addedAt: new Date() });
    }

    await user.save();
    // Return populated cart
    const updatedUser = await User.findById(req.user.id).populate('cart.productId');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    const item = user.cart.find(item => item.productId.equals(req.params.productId));
    if (!item) return res.status(404).json({ error: 'Item not in cart' });

    item.quantity = quantity;
    await user.save();

    // Return populated cart
    const updatedUser = await User.findById(req.user.id).populate('cart.productId');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { cart: { productId: req.params.productId } }
    });
    // Return updated populated cart
    const updatedUser = await User.findById(req.user.id).populate('cart.productId');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist.productId');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    const exists = user.wishlist.some(item => item.productId.equals(productId));
    if (!exists) {
      user.wishlist.push({ productId, addedAt: new Date() });
      await user.save();
    }

    // Return populated wishlist
    const updatedUser = await User.findById(req.user.id).populate('wishlist.productId');
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { wishlist: { productId: req.params.productId } }
    });
    
    // Return updated populated wishlist
    const updatedUser = await User.findById(req.user.id).populate('wishlist.productId');
    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // If this is the first address or isDefault is true, set all other addresses to non-default
    if (user.addresses.length === 0 || req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ error: 'Address not found' });

    // If setting this address as default, update other addresses
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, req.body);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If deleting default address, make the first remaining address default
    if (address.isDefault && user.addresses.length > 1) {
      const remainingAddresses = user.addresses.filter(addr => !addr._id.equals(req.params.addressId));
      if (remainingAddresses.length > 0) {
        remainingAddresses[0].isDefault = true;
      }
    }

    user.addresses.pull(req.params.addressId);
    await user.save();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;
    
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

