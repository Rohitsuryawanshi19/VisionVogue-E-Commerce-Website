const express = require('express');
const router = express.Router();
const { Product } = require('../models');

router.get('/', async (req, res) => {
  const [newArrivals, bestSellers, sunglasses] = await Promise.all([
    Product.find({ isNew: true }).limit(8),
    Product.find().sort({ reviewCount: -1 }).limit(8),
    Product.find({ category: 'Sunglasses' }).limit(8)
  ]);
  res.render('index', { newArrivals, bestSellers, sunglasses, activePage: 'home' });
});

router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const results = await Product.find({ name: { $regex: q, $options: 'i' } }).limit(10);
  res.json(results);
});

router.get('/virtual-try-on', (req, res) => {
  res.render('pages/virtual-try-on', { activePage: 'vto' });
});

router.get('/stores', (req, res) => {
  res.render('pages/stores', { activePage: 'stores' });
});

router.get('/try-at-home', (req, res) => {
  res.render('pages/try-at-home', { activePage: 'tah' });
});

router.get('/about-us', (req, res) => {
  res.render('pages/about-us', { activePage: 'about' });
});

router.get('/careers', (req, res) => {
  res.render('pages/careers', { activePage: 'careers' });
});

router.get('/contacts', (req, res) => {
  res.render('pages/contacts', { activePage: 'contacts' });
});

router.get('/special-power', async (req, res) => {
  const products = await Product.find({ category: 'Special Power' }).limit(12);
  res.render('pages/special-power', { products, activePage: 'special-power' });
});

router.get('/checkout', async (req, res) => {
  const cart = req.session.cart || [];
  const subtotal = cart.reduce((sum, i) => sum + (i.price + i.lensPrice) * i.qty, 0);
  res.render('pages/checkout', { activePage: '', cart, subtotal });
});

module.exports = router;
