// Mongoose models are self-registering (mongoose.model(...) in each file),
// so this file just re-exports them plus the connection helper for convenience.
const { connectDB, mongoose } = require('../config/database');
const Product = require('./product');
const Order = require('./order');
const User = require('./user');

module.exports = { connectDB, mongoose, Product, Order, User };
