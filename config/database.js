const mongoose = require('mongoose');

// Connection string comes from environment variable MONGODB_URI.
// Falls back to a local MongoDB instance for development.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/VisionVogue';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };
