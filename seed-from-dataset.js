// Seeds the database. In production with the real archive.zip dataset, this script
// would scan archive_extracted/{eyeglasses,sunglasses}/<id>/{product,review}/ and copy
// real photography. Since no dataset was supplied, we generate tasteful placeholder
// imagery via generate-placeholder-images.js so the whole site is demo-ready end to end.
const { connectDB, mongoose, Product } = require('./models');
const { buildProduct } = require('./generate-placeholder-images');

const NAMES_EYE = [
  'Aurelia Round', 'Monarch Rectangle', 'Vesper Cat Eye', 'Lumen Square', 'Regalia Aviator',
  'Ostrava Browline', 'Celeste Round', 'Windsor Rectangle', 'Marchetti Cat Eye', 'Halcyon Square',
  'Beaumont Aviator', 'Sabrina Browline', 'Everly Round', 'Kingsley Rectangle', 'Odette Cat Eye',
  'Thorncliff Square', 'Bellamy Aviator', 'Isadora Browline', 'Fenwick Round', 'Genevieve Rectangle',
  'Sorrento Cat Eye', 'Prescott Square', 'Adalyn Aviator', 'Winslow Browline', 'Marchetti Zero-Power',
  'Aveline Progressive'
];
const NAMES_SUN = [
  'Solstice Aviator', 'Riviera Round', 'Havana Square', 'Capri Cat Eye', 'Palermo Rectangle',
  'Marbella Aviator', 'Coastal Round', 'Sundown Square', 'Azure Cat Eye', 'Verona Rectangle',
  'Tropez Aviator', 'Malibu Round', 'Onyx Square', 'Milano Cat Eye', 'Ibiza Rectangle'
];

const MATERIALS = ['Acetate', 'TR90 Lightweight', 'Titanium Alloy', 'Metal Alloy', 'Polycarbonate'];

async function seed() {
  await connectDB();
  await Product.deleteMany({});

  let id = 1;
  const products = [];

  for (let i = 0; i < NAMES_EYE.length; i++) {
    const built = buildProduct(id, 'Eyeglasses');
    const basePrice = 1800 + (id % 12) * 650;
    const discount = id % 5 === 0 ? 20 : id % 3 === 0 ? 10 : 0;
    products.push({
      name: NAMES_EYE[i],
      price: basePrice,
      color: built.color,
      frameSize: ['S', 'M', 'L', 'XL'][id % 4],
      description: `The ${NAMES_EYE[i]} pairs a refined ${built.style.toLowerCase()} silhouette with premium ${MATERIALS[id % MATERIALS.length]}, engineered for all-day comfort and everyday sophistication.`,
      image: built.mainImage,
      images: built.images,
      reviewImages: built.reviewImages,
      category: 'Eyeglasses',
      style: built.style,
      gender: built.gender,
      material: MATERIALS[id % MATERIALS.length],
      stock: 8 + (id % 15),
      discount,
      isNew: id % 6 === 0,
      rating: Number((4 + (id % 10) / 10).toFixed(1)),
      reviewCount: 20 + id * 3,
      weight: `${14 + (id % 10)}g`,
      eyeSize: `${48 + (id % 8)}mm`,
      bridgeWidth: `${16 + (id % 4)}mm`,
      templeLength: `${138 + (id % 6)}mm`
    });
    id++;
  }

  for (let i = 0; i < NAMES_SUN.length; i++) {
    const built = buildProduct(id, 'Sunglasses');
    const basePrice = 2400 + (id % 10) * 700;
    const discount = id % 4 === 0 ? 15 : id % 7 === 0 ? 25 : 0;
    products.push({
      name: NAMES_SUN[i],
      price: basePrice,
      color: built.color,
      frameSize: ['S', 'M', 'L', 'XL'][id % 4],
      description: `The ${NAMES_SUN[i]} delivers UV400-protected polarized clarity in a ${built.style.toLowerCase()} frame, finished with ${MATERIALS[id % MATERIALS.length]} for luxury durability.`,
      image: built.mainImage,
      images: built.images,
      reviewImages: built.reviewImages,
      category: 'Sunglasses',
      style: built.style,
      gender: built.gender,
      material: MATERIALS[id % MATERIALS.length],
      stock: 6 + (id % 12),
      discount,
      isNew: id % 5 === 0,
      rating: Number((4 + (id % 10) / 10).toFixed(1)),
      reviewCount: 15 + id * 2,
      weight: `${16 + (id % 8)}g`,
      eyeSize: `${50 + (id % 6)}mm`,
      bridgeWidth: `${17 + (id % 3)}mm`,
      templeLength: `${140 + (id % 5)}mm`
    });
    id++;
  }

  await Product.insertMany(products);
  console.log(`=== Done! Imported ${products.length} products. ===`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
