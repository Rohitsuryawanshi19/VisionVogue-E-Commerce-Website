const express = require('express');
const router = express.Router();
const { Product, Order } = require('../models');

router.get('/', async (req, res) => {
  const [productCount, orderCount, orders, lowStock] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(10),
    Product.find({ stock: { $lt: 10 } }).limit(6)
  ]);
  const revenueAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const revenueResult = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
  res.render('admin/index', {
    productCount, orderCount, orders, lowStock,
    revenue: revenueResult || 0,
    activePage: 'admin'
  });
});

module.exports = router;
