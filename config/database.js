const mongoose = require('mongoose');

// Connection string comes from environment variable MONGODB_URI.
// Falls back to a local MongoDB instance for development.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/VisionVogue';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.warn('MongoDB connection warning (Cloud DB URI needed):', err.message);
  }
}

module.exports = { connectDB, mongoose };
