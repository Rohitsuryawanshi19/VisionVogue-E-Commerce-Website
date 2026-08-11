require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB, mongoose, Product } = require('./models');

const SOURCE_ROOT = path.join(__dirname, 'scratch', 'dataset_extracted', 'eyeglasses');
const DEST_ROOT = path.join(__dirname, 'public', 'images', 'products');

const EYEGLASS_NAMES = [
  'Aurelia Round', 'Monarch Rectangle', 'Vesper Cat Eye', 'Lumen Square', 'Regalia Aviator',
  'Ostrava Browline', 'Celeste Round', 'Windsor Rectangle', 'Marchetti Cat Eye', 'Halcyon Square',
  'Beaumont Aviator', 'Sabrina Browline', 'Everly Round', 'Kingsley Rectangle', 'Odette Cat Eye',
  'Thorncliff Square', 'Bellamy Aviator', 'Isadora Browline', 'Fenwick Round', 'Genevieve Rectangle',
  'Sorrento Cat Eye', 'Prescott Square', 'Adalyn Aviator', 'Winslow Browline', 'Marchetti Zero-Power',
  'Aveline Progressive', 'Vortex Titanium', 'Zenith Half-Rim', 'Bespoke Executive', 'Cadence Minimalist'
];

const SUNGLASS_NAMES = [
  'Solstice Aviator', 'Riviera Round', 'Havana Square', 'Capri Cat Eye', 'Palermo Rectangle',
  'Marbella Aviator', 'Coastal Round', 'Sundown Square', 'Azure Cat Eye', 'Verona Rectangle',
  'Tropez Aviator', 'Malibu Round', 'Onyx Square', 'Milano Cat Eye', 'Ibiza Rectangle',
  'Vanguard Polarized', 'Catalina Gradient', 'Apex Sport Shield', 'Elysian Tortoise', 'Monaco Gold'
];

const COLORS = ['Onyx Black', 'Tortoise Shell', 'Rose Gold', 'Gunmetal Gray', 'Champagne Gold', 'Midnight Blue', 'Crystal Clear', 'Emerald Green', 'Deep Amber'];
const STYLES = ['Aviator', 'Round', 'Rectangle', 'Square', 'Cat Eye', 'Browline'];
const MATERIALS = ['Italian Acetate', 'TR90 Lightweight', 'Grade 5 Titanium', 'Metal Alloy', 'Organic Cellulose'];
const GENDERS = ['Men', 'Women', 'Unisex'];

async function importDataset() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error('Source directory does not exist:', SOURCE_ROOT);
    process.exit(1);
  }

  await connectDB();
  console.log('Clearing existing product collection...');
  await Product.deleteMany({});

  const folderNames = fs.readdirSync(SOURCE_ROOT).filter(f => {
    return fs.statSync(path.join(SOURCE_ROOT, f)).isDirectory();
  });

  console.log(`Found ${folderNames.length} extracted product folders.`);

  const productsToInsert = [];
  let nextId = 1;

  for (const folderName of folderNames) {
    const folderPath = path.join(SOURCE_ROOT, folderName);
    const prodDir = path.join(folderPath, 'product');
    const revDir = path.join(folderPath, 'review');

    const prodFiles = fs.existsSync(prodDir)
      ? fs.readdirSync(prodDir).filter(f => /\.(jpg|jpeg|png|webp|svg)$/i.test(f)).sort()
      : [];

    if (prodFiles.length === 0) continue;

    const revFiles = fs.existsSync(revDir)
      ? fs.readdirSync(revDir).filter(f => /\.(jpg|jpeg|png|webp|svg)$/i.test(f)).sort()
      : [];

    const idStr = String(nextId);
    const destDir = path.join(DEST_ROOT, idStr);
    const destRevDir = path.join(destDir, 'reviews');

    fs.mkdirSync(destDir, { recursive: true });
    if (revFiles.length > 0) fs.mkdirSync(destRevDir, { recursive: true });

    const galleryPaths = [];
    prodFiles.forEach(file => {
      const destFile = path.join(destDir, file);
      try {
        if (!fs.existsSync(destFile)) {
          fs.copyFileSync(path.join(prodDir, file), destFile);
        }
      } catch (e) {}
      galleryPaths.push(`/images/products/${idStr}/${file}`);
    });

    const reviewPaths = [];
    revFiles.forEach(file => {
      const destFile = path.join(destRevDir, file);
      try {
        if (!fs.existsSync(destFile)) {
          fs.copyFileSync(path.join(revDir, file), destFile);
        }
      } catch (e) {}
      reviewPaths.push(`/images/products/${idStr}/reviews/${file}`);
    });

    // Detect category: alternate between Eyeglasses, Sunglasses, and Special Power
    const firstFile = prodFiles[0].toLowerCase();
    let category = 'Eyeglasses';
    if (firstFile.startsWith('sp') || firstFile.startsWith('pl') || firstFile.startsWith('wd') || firstFile.startsWith('lupl') || nextId % 2 === 0) {
      category = 'Sunglasses';
    }
    if (nextId % 9 === 0) {
      category = 'Special Power';
    }

    const nameList = category === 'Sunglasses' ? SUNGLASS_NAMES : EYEGLASS_NAMES;
    const baseName = nameList[(nextId - 1) % nameList.length];
    const productName = `${baseName} ${Math.floor(nextId / nameList.length) > 0 ? '#' + (Math.floor(nextId / nameList.length) + 1) : ''}`.trim();

    const style = STYLES[nextId % STYLES.length];
    const color = COLORS[nextId % COLORS.length];
    const gender = GENDERS[nextId % GENDERS.length];
    const material = MATERIALS[nextId % MATERIALS.length];
    const basePrice = category === 'Sunglasses' ? 2400 + (nextId % 15) * 450 : 1800 + (nextId % 12) * 550;
    const discount = nextId % 5 === 0 ? 20 : nextId % 3 === 0 ? 15 : 0;

    productsToInsert.push({
      name: productName,
      price: basePrice,
      color: color,
      frameSize: ['S', 'M', 'L', 'XL'][nextId % 4],
      description: `The ${productName} combines a timeless ${style.toLowerCase()} silhouette with handcrafted ${material}. Features scratch-resistant optical lenses and ergonomic flex hinges for all-day comfort.`,
      image: galleryPaths[0],
      images: galleryPaths,
      reviewImages: reviewPaths,
      category: category,
      style: style,
      gender: gender,
      material: material,
      stock: 5 + (nextId % 20),
      discount: discount,
      isNew: nextId % 4 === 0,
      rating: Number((4.2 + (nextId % 8) / 10).toFixed(1)),
      reviewCount: reviewPaths.length > 0 ? reviewPaths.length * 3 + (nextId % 12) : 15 + (nextId % 25),
      weight: `${14 + (nextId % 8)}g`,
      eyeSize: `${49 + (nextId % 6)}mm`,
      bridgeWidth: `${16 + (nextId % 4)}mm`,
      templeLength: `${138 + (nextId % 6)}mm`
    });

    nextId++;
  }

  console.log(`Inserting ${productsToInsert.length} products with real images into MongoDB...`);
  await Product.insertMany(productsToInsert);
  console.log(`=== Done! Imported ${productsToInsert.length} real dataset products into VisionVogue database! ===`);

  await mongoose.disconnect();
  process.exit(0);
}

importDataset().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
