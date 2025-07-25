const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Auth & Profile
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/profile/password', auth, userController.updatePassword);

// Wallet
router.get('/wallet', auth, userController.getWalletDetails);
router.post('/wallet/add', auth, userController.addWalletMoney);
router.get('/wallet/transactions', auth, userController.getWalletTransactions);

// Points
router.get('/points', auth, userController.getPointsDetails);
router.post('/points/redeem', auth, userController.redeemPoints);
router.get('/points/transactions', auth, userController.getPointsTransactions);

// Wishlist
router.get('/wishlist', auth, userController.getWishlist);
router.post('/wishlist', auth, userController.addToWishlist);
router.delete('/wishlist/:productId', auth, userController.removeFromWishlist);

// Cart
router.get('/cart', auth, userController.getCart);
router.post('/cart', auth, userController.addToCart);
router.put('/cart/:productId', auth, userController.updateCartItem);
router.delete('/cart/:productId', auth, userController.removeFromCart);

// Addresses
router.get('/addresses', auth, userController.getAddresses);
router.post('/addresses', auth, userController.addAddress);
router.put('/addresses/:addressId', auth, userController.updateAddress);
router.delete('/addresses/:addressId', auth, userController.deleteAddress);
router.put('/addresses/:addressId/default', auth, userController.setDefaultAddress);

module.exports = router;