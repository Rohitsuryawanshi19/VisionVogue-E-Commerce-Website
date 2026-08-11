const express = require('express');
const router = express.Router();
const { Product, Order } = require('../models');

router.post('/add', async (req, res) => {
  const { productId, qty, lensUpgrade, lensPrice, prescription } = req.body;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (!product) return res.status(404).json({ error: 'Not found' });

  const item = {
    productId: product._id.toString(),
    name: product.name,
    image: product.image,
    price: product.price,
    lensUpgrade: lensUpgrade || 'Standard Lenses',
    lensPrice: Number(lensPrice) || 0,
    prescription: prescription || null,
    qty: Number(qty) || 1
  };

  req.session.cart.push(item);
  res.json({ success: true, cartCount: req.session.cart.reduce((s, i) => s + i.qty, 0) });
});

router.post('/remove/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (req.session.cart && !isNaN(index) && index >= 0 && index < req.session.cart.length) {
    req.session.cart.splice(index, 1);
  }
  if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.json({ success: true, cartCount: (req.session.cart || []).reduce((s, i) => s + i.qty, 0) });
  }
  res.redirect('/cart');
});

router.post('/update/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const qty = parseInt(req.body.qty);
  if (req.session.cart && !isNaN(index) && index >= 0 && index < req.session.cart.length) {
    if (qty > 0) {
      req.session.cart[index].qty = qty;
    } else {
      req.session.cart.splice(index, 1);
    }
  }
  if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.json({ success: true, cartCount: (req.session.cart || []).reduce((s, i) => s + i.qty, 0) });
  }
  res.redirect('/cart');
});

router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce((sum, i) => sum + (i.price + i.lensPrice) * i.qty, 0);
  res.render('pages/cart', { cart, subtotal, activePage: '' });
});

router.post('/checkout', async (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    req.flash('error', 'Your shopping bag is empty.');
    return res.redirect('/cart');
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price + i.lensPrice) * i.qty, 0);
  const total = subtotal;

  const paymentMethod = req.body.paymentMethod || 'UPI';
  const paymentTxnId = req.body.paymentTxnId || ('TXN-' + Date.now());
  const paymentStatus = paymentMethod === 'COD' ? 'Pending (Pay on Delivery)' : 'Paid (Verified Instant)';

  const orderNumber = 'VV' + Math.floor(100000 + Math.random() * 900000);

  const initialTimeline = [
    {
      status: 'Order Placed & Payment Verified',
      timestamp: new Date(),
      location: 'Milano Central Hub',
      note: `Payment confirmed via ${paymentMethod} (Ref: ${paymentTxnId}). Frame reserved.`
    },
    {
      status: 'Prescription Lens Precision Assembly',
      timestamp: new Date(Date.now() + 60000),
      location: 'VisionVogue Optical Lab',
      note: 'Robotic laser beveling, anti-reflective coating & UV400 inspection.'
    },
    {
      status: 'Handed Over to Courier Partner',
      timestamp: new Date(Date.now() + 180000),
      location: 'Blue Dart Air Express Logistics Center',
      note: `Airway Bill #BD${Math.floor(100000 + Math.random() * 900000)} generated.`
    },
    {
      status: 'Out for Delivery',
      timestamp: new Date(Date.now() + 300000),
      location: req.body.city || 'Destination Hub',
      note: 'Assigned to local delivery associate.'
    }
  ];

  const order = await Order.create({
    userId: req.session.user ? req.session.user.id : null,
    orderNumber: orderNumber,
    items: cart,
    shippingDetails: {
      fullName: req.body.fullName,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      pincode: req.body.pincode
    },
    totalAmount: total,
    paymentMethod: paymentMethod,
    paymentStatus: paymentStatus,
    paymentTxnId: paymentTxnId,
    status: 'Order Placed & Lens Fitting',
    trackingTimeline: initialTimeline
  });

  req.session.cart = [];
  req.flash('success', `Order #${order.orderNumber} placed successfully! Real-time tracking activated.`);
  res.redirect(`/support/track-order?order=${order.orderNumber}`);
});

module.exports = router;
