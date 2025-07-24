const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Auth
router.post('/register', userController.register);
router.post('/login', userController.login);

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

module.exports = router;