const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

router.post('/', auth, orderController.placeOrder);
router.get('/', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/cancel', auth, orderController.cancelOrder);

module.exports = router;
