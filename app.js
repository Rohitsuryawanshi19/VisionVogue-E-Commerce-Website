require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const { connectDB } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'visionvogue-luxury-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());

// Simple in-memory cart stored in session
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  res.locals.cartCount = req.session.cart.reduce((sum, i) => sum + i.qty, 0);
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

app.use('/', require('./routes/index'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/auth', require('./routes/auth'));
app.use('/support', require('./routes/support'));
app.use('/admin', require('./routes/admin'));

app.use((req, res) => {
  res.status(404).render('404');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`VisionVogue running at http://localhost:${PORT}`);
  });
});

module.exports = app;
