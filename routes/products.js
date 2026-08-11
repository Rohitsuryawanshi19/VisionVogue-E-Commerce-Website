const express = require('express');
const router = express.Router();
const { Product } = require('../models');

function buildWhere(query) {
  const where = {};
  if (query.style) where.style = Array.isArray(query.style) ? { $in: query.style } : query.style;
  if (query.gender) where.gender = Array.isArray(query.gender) ? { $in: query.gender } : query.gender;
  if (query.tier === 'essential') where.price = { $lt: 2500 };
  if (query.tier === 'premium') where.price = { $gte: 2500 };
  if (query.tier === 'sale') where.discount = { $gt: 0 };
  if (query.priceMax) where.price = { ...(where.price || {}), $lte: Number(query.priceMax) };
  if (query.search) where.name = { $regex: query.search, $options: 'i' };
  return where;
}

router.get('/', async (req, res) => {
  const where = buildWhere(req.query);
  const products = await Product.find(where).sort({ createdAt: -1 });
  res.render('products/index', {
    products, category: 'All Collections', query: req.query, activePage: 'products'
  });
});

router.get('/category/:cat', async (req, res) => {
  const cat = req.params.cat;
  const where = buildWhere(req.query);
  where.category = new RegExp('^' + cat + '$', 'i');
  const products = await Product.find(where).sort({ createdAt: -1 });
  res.render('products/index', {
    products, category: cat, query: req.query, activePage: 'products'
  });
});

router.get('/:id', async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.params.id);
  } catch (err) {
    // Invalid ObjectId format
    return res.status(404).render('404');
  }
  if (!product) return res.status(404).render('404');
  const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
  res.render('products/show', { product, related, activePage: 'products' });
});

module.exports = router;
