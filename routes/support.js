const express = require('express');
const router = express.Router();
const { Order } = require('../models');

router.get('/track-order', async (req, res) => {
  let order = null;
  if (req.query.order) {
    order = await Order.findOne({ orderNumber: req.query.order });
    if (order) {
      // Real-time Order Progression logic based on elapsed time since order creation
      const elapsedMins = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
      let newStatus = order.status;

      if (elapsedMins >= 5 && order.status !== 'Delivered') {
        newStatus = 'Delivered';
      } else if (elapsedMins >= 3 && elapsedMins < 5 && order.status !== 'In Transit' && order.status !== 'Delivered') {
        newStatus = 'In Transit';
      } else if (elapsedMins >= 1 && elapsedMins < 3 && order.status === 'Order Placed & Lens Fitting') {
        newStatus = 'In Lab — Precision Lens Customization';
      }

      if (newStatus !== order.status) {
        order.status = newStatus;
        await order.save();
      }
    }
  }
  const recentOrders = req.session.user
    ? await Order.find({ userId: req.session.user.id }).sort({ createdAt: -1 })
    : [];
  res.render('support/track-order', { order, recentOrders, activePage: 'support' });
});

router.get('/returns', (req, res) => res.render('support/returns', { activePage: 'support' }));
router.get('/shipping', (req, res) => res.render('support/shipping', { activePage: 'support' }));
router.get('/prescription', (req, res) => res.render('support/prescription', { activePage: 'support' }));

module.exports = router;
