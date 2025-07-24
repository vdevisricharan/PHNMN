const Order = require('../../models/Order');

exports.placeOrder = async (req, res) => {
  const { items, addressSnapshot, subtotal, totalAmount } = req.body;
  const order = new Order({
    userId: req.user.id,
    items,
    addressSnapshot,
    subtotal,
    totalAmount,
    placedAt: new Date()
  });

  await order.save();
  res.status(201).json(order);
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ placedAt: -1 });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  res.json(order);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status: 'cancelled', cancelledAt: new Date() },
    { new: true }
  );
  res.json(order);
};
