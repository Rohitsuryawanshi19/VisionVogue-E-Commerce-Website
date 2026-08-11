const { mongoose } = require('../config/database');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: null },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  rewardPoints: { type: Number, default: 450 },
  membershipTier: { type: String, default: 'Gold VIP Member' },
  prescription: {
    sphOD: { type: String, default: '-2.25' },
    cylOD: { type: String, default: '-0.75' },
    axisOD: { type: String, default: '90°' },
    sphOS: { type: String, default: '-2.50' },
    cylOS: { type: String, default: '-1.00' },
    axisOS: { type: String, default: '180°' },
    pd: { type: String, default: '63mm' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
