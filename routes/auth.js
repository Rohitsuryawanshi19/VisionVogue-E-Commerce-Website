const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Order } = require('../models');

router.get('/login', (req, res) => res.render('pages/login', { activePage: '' }));
router.get('/register', (req, res) => res.render('pages/register', { activePage: '' }));

// Quick Demo Login helper for testing
router.get('/demo-login', async (req, res) => {
  let demoUser = await User.findOne({ email: 'vip@visionvogue.com' });
  if (!demoUser) {
    const hash = await bcrypt.hash('password123', 10);
    demoUser = await User.create({
      name: 'Alexander Sterling',
      email: 'vip@visionvogue.com',
      phone: '+91 98765 43210',
      password: hash,
      rewardPoints: 1250,
      membershipTier: 'VisionVogue Platinum VIP'
    });
    // Create a sample demo order
    await Order.create({
      userId: demoUser._id,
      orderNumber: 'VV-8849201',
      items: [
        { name: 'Solstice Aviator', price: 2850, lensUpgrade: 'Polarized UV400', lensPrice: 0, qty: 1 }
      ],
      shippingDetails: { fullName: 'Alexander Sterling', city: 'Mumbai', pincode: '400050' },
      totalAmount: 2850,
      status: 'In Transit'
    });
  }
  req.session.user = { id: demoUser._id.toString(), name: demoUser.name, email: demoUser.email };
  req.flash('success', 'Logged in as VIP Member: ' + demoUser.name);
  res.redirect('/auth/profile');
});

router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in to view your account dashboard.');
    return res.redirect('/auth/login');
  }

  const user = await User.findById(req.session.user.id);
  if (!user) {
    req.session.user = null;
    return res.redirect('/auth/login');
  }

  const orders = await Order.find({
    $or: [{ userId: user._id }, { userId: user._id.toString() }]
  }).sort({ createdAt: -1 });

  res.render('pages/profile', {
    userDoc: user,
    orders,
    activePage: 'profile'
  });
});

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, phone, password: hash,
      rewardPoints: 450,
      membershipTier: 'VisionVogue Gold VIP'
    });
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    req.flash('success', 'Welcome to VisionVogue! 450 Reward Points credited.');
    res.redirect('/auth/profile');
  } catch (err) {
    req.flash('error', 'Could not register. Email may already be in use.');
    res.redirect('/auth/register');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    req.flash('error', 'Invalid email or password.');
    return res.redirect('/auth/login');
  }
  req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
  req.flash('success', 'Welcome back, ' + user.name + '!');
  res.redirect('/auth/profile');
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  req.flash('success', 'You have been logged out.');
  res.redirect('/');
});

module.exports = router;
