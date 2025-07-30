const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  const {
    items,
    shippingAddress,
    billingAddress,
    subtotal,
    discount = 0,
    shipping = 0,
    tax = 0,
    total,
    paymentMethod,
    paymentStatus = 'pending',
    orderStatus = 'pending',
    trackingNumber,
    pointsEarned = 0,
    pointsUsed = 0,
    estimatedDelivery
  } = req.body;

  const order = new Order({
    userId: req.user.id,
    items,
    shippingAddress,
    billingAddress,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    paymentMethod,
    paymentStatus,
    orderStatus,
    trackingNumber,
    pointsEarned,
    pointsUsed,
    estimatedDelivery
    // createdAt and updatedAt handled by schema
  });

  await order.save();
  // Populate product details in items
  await Order.populate(order, { path: 'items.productId' });
  res.status(201).json(order);
};

// Updated: Paginated orders response
exports.getUserOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId: req.user.id })
      .sort({ placedAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ userId: req.user.id })
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  const updatedOrders = await Order.populate(orders, {path: 'items.productId'});

  res.json({
    orders: updatedOrders,
    currentPage: page,
    totalPages,
    hasMore
  });
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  await Order.populate(order, { path: 'items.productId' });
  res.json(order);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findOneAndUpdate( 
    { _id: req.params.id, userId: req.user.id },
    { orderStatus: 'cancelled' },
    { new: true }
  );
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  await Order.populate(order, { path: 'items.productId' });
  res.json(order);
};
