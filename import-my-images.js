// ============================================================================
// import-my-images.js
//
// Lets you use YOUR OWN photos instead of the generated placeholder images,
// without touching any code.
//
// HOW TO USE:
// 1. In the project root, create a folder called "my-photos" (if it doesn't
//    already exist — this script will create it for you on first run).
// 2. Inside "my-photos", create one subfolder per product, named after the
//    product (spaces/case don't matter — "aurelia round", "Aurelia-Round",
//    and "AURELIA ROUND" all match the product named "Aurelia Round").
// 3. Drop your image files into that subfolder:
//      - Any file with "review" in its name  -> customer review photo
//      - Every other image                   -> product gallery photo
//        (the first one alphabetically becomes the main cover image)
// 4. Run:  node import-my-images.js
//
// Example:
//   my-photos/
//     Aurelia Round/
//       front.jpg
//       side.jpg
//       model-wearing.jpg
//       review-1.jpg
//       review-2.jpg
//
// Re-run this script any time you add more photos — it only touches
// products that have a matching folder, and skips everything else.
// ============================================================================

const fs = require('fs');
const path = require('path');
const { connectDB, Product, mongoose } = require('./models');

const SOURCE_DIR = path.join(__dirname, 'my-photos');
const DEST_ROOT = path.join(__dirname, 'public', 'images', 'products');
const VALID_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

async function run() {
  if (!fs.existsSync(SOURCE_DIR)) {
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
    console.log(`Created "${SOURCE_DIR}".`);
    console.log('Add a subfolder per product (named after the product) with your images inside, then run this script again.');
    process.exit(0);
  }

  await connectDB();

  const products = await Product.find({});
  const folders = fs.readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  if (folders.length === 0) {
    console.log(`No subfolders found inside "${SOURCE_DIR}".`);
    console.log('Create one subfolder per product (named after the product) and put images inside it.');
    process.exit(0);
  }

  // Build a lookup: slug(productName) -> product doc
  const bySlug = {};
  products.forEach(p => { bySlug[slugify(p.name)] = p; });

  let updated = 0, skipped = 0;

  for (const folder of folders) {
    const folderSlug = slugify(folder.name);
    const product = bySlug[folderSlug];

    if (!product) {
      console.log(`⚠️  No product matches folder "${folder.name}" — skipping. (Check spelling against the product name in the database.)`);
      skipped++;
      continue;
    }

    const folderPath = path.join(SOURCE_DIR, folder.name);
    const files = fs.readdirSync(folderPath)
      .filter(f => VALID_EXT.includes(path.extname(f).toLowerCase()))
      .sort();

    if (files.length === 0) {
      console.log(`⚠️  Folder "${folder.name}" has no image files — skipping.`);
      skipped++;
      continue;
    }

    const destDir = path.join(DEST_ROOT, product._id.toString());
    const reviewDestDir = path.join(destDir, 'reviews');
    fs.mkdirSync(destDir, { recursive: true });
    fs.mkdirSync(reviewDestDir, { recursive: true });

    const galleryPaths = [];
    const reviewPaths = [];

    files.forEach(file => {
      const isReview = file.toLowerCase().includes('review');
      const destSubdir = isReview ? reviewDestDir : destDir;
      const destFile = path.join(destSubdir, file);
      fs.copyFileSync(path.join(folderPath, file), destFile);

      const webPath = isReview
        ? `/images/products/${product._id}/reviews/${file}`
        : `/images/products/${product._id}/${file}`;

      if (isReview) reviewPaths.push(webPath);
      else galleryPaths.push(webPath);
    });

    product.image = galleryPaths[0] || product.image;
    product.images = galleryPaths.length ? galleryPaths : product.images;
    if (reviewPaths.length) product.reviewImages = reviewPaths;

    await product.save();
    console.log(`✅  Updated "${product.name}" — ${galleryPaths.length} gallery photo(s), ${reviewPaths.length} review photo(s).`);
    updated++;
  }

  console.log(`\n=== Done! Updated ${updated} product(s), skipped ${skipped}. ===`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
