const { mongoose } = require('../config/database');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: true },
  frameSize: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: null },       // main cover image path
  images: { type: [String], default: [] },      // angle image paths (array, not JSON string)
  reviewImages: { type: [String], default: [] },// customer photo paths
  category: { type: String, required: true },   // Eyeglasses | Sunglasses | Contacts | Special Power
  style: { type: String, required: true },
  gender: { type: String, required: true },
  material: { type: String, default: 'Acetate' },
  brand: { type: String, default: 'VisionVogue' },
  stock: { type: Number, default: 10 },
  discount: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  weight: { type: String, default: '18g' },
  eyeSize: { type: String, default: '52mm' },
  bridgeWidth: { type: String, default: '18mm' },
  templeLength: { type: String, default: '140mm' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
