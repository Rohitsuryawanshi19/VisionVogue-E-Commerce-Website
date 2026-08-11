const { mongoose } = require('../config/database');
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  orderNumber: { type: String, required: true },
  items: { type: Array, required: true },
  shippingDetails: { type: Schema.Types.Mixed, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: { type: String, default: 'Paid' },
  paymentTxnId: { type: String, default: null },
  status: { type: String, default: 'Order Placed & Lens Fitting' },
  trackingTimeline: [{
    status: String,
    timestamp: Date,
    location: String,
    note: String
  }],
  cancelled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
