const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash });
  await user.save();
  res.status(201).json(user);
};

exports.login = async (req, res) => {
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
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.productId');
  res.json(user.cart);
};

exports.addToCart = async (req, res) => {
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
  res.json(user.cart);
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user.id);

  const item = user.cart.find(item => item.productId.equals(req.params.productId));
  if (!item) return res.status(404).json({ error: 'Item not in cart' });

  item.quantity = quantity;
  await user.save();
  res.json(user.cart);
};

exports.removeFromCart = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { cart: { productId: req.params.productId } }
  });
  res.sendStatus(204);
};

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist.productId');
  res.json(user.wishlist);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);

  const exists = user.wishlist.some(item => item.productId.equals(productId));
  if (!exists) {
    user.wishlist.push({ productId, addedAt: new Date() });
    await user.save();
  }

  res.json(user.wishlist);
};

exports.removeFromWishlist = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { wishlist: { productId: req.params.productId } }
  });
  res.sendStatus(204);
};

exports.getAddresses = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.addresses);
};

exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.push(req.body);
  await user.save();
  res.json(user.addresses);
};

exports.updateAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ error: 'Address not found' });

  Object.assign(address, req.body);
  await user.save();
  res.json(user.addresses);
};

exports.deleteAddress = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { addresses: { _id: req.params.addressId } }
  });
  res.sendStatus(204);
};

