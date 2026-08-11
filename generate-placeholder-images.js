// Generates elegant SVG placeholder images for eyewear products & customer review shots.
// This substitutes the real photography dataset referenced in the PRD (archive.zip),
// which was not provided. Swap /public/images/products/<id>/ with real photos anytime —
// the app only cares about file names, not how they were produced.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const frameColors = ['#2b2b2b', '#8b5e34', '#1e3a5f', '#5c1a1a', '#3d3d3d', '#6b4226', '#22403a', '#4a2b45'];
const skinTones = ['#e8b898', '#c68a5f', '#a8703f', '#f0c9a0', '#8d5a3c'];

function frameSVG(color, style) {
  // Simple glasses-shape illustration
  let lensShape = style === 'Round'
    ? `<circle cx="150" cy="200" r="70" fill="none" stroke="${color}" stroke-width="10"/><circle cx="350" cy="200" r="70" fill="none" stroke="${color}" stroke-width="10"/>`
    : style === 'Cat Eye'
    ? `<path d="M85 170 Q150 130 220 175 Q220 250 150 260 Q85 250 85 170 Z" fill="none" stroke="${color}" stroke-width="10"/><path d="M280 175 Q350 130 415 170 Q415 250 350 260 Q280 250 280 175 Z" fill="none" stroke="${color}" stroke-width="10"/>`
    : style === 'Aviator'
    ? `<path d="M90 190 Q150 130 210 190 Q220 260 150 275 Q80 260 90 190 Z" fill="none" stroke="${color}" stroke-width="10"/><path d="M290 190 Q350 130 410 190 Q420 260 350 275 Q280 260 290 190 Z" fill="none" stroke="${color}" stroke-width="10"/>`
    : `<rect x="85" y="140" width="130" height="110" rx="18" fill="none" stroke="${color}" stroke-width="10"/><rect x="285" y="140" width="130" height="110" rx="18" fill="none" stroke="${color}" stroke-width="10"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400">
    <rect width="500" height="400" fill="#f7f5f2"/>
    <g>
      ${lensShape}
      <line x1="215" y1="200" x2="285" y2="200" stroke="${color}" stroke-width="8"/>
      <line x1="90" y1="185" x2="30" y2="160" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
      <line x1="410" y1="185" x2="470" y2="160" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    </g>
  </svg>`;
}

function modelSVG(color, skin, gender) {
  const hair = gender === 'Women' ? `<path d="M150 60 Q250 20 350 60 L360 190 Q340 130 250 120 Q160 130 140 190 Z" fill="#2a1a12"/>` : `<path d="M160 70 Q250 40 340 70 L345 140 Q250 100 155 140 Z" fill="#2a1a12"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400">
    <rect width="500" height="400" fill="#eae6df"/>
    <ellipse cx="250" cy="230" rx="120" ry="150" fill="${skin}"/>
    ${hair}
    <g transform="translate(0,10)">
      <rect x="140" y="185" width="90" height="70" rx="14" fill="none" stroke="${color}" stroke-width="9"/>
      <rect x="270" y="185" width="90" height="70" rx="14" fill="none" stroke="${color}" stroke-width="9"/>
      <line x1="230" y1="215" x2="270" y2="215" stroke="${color}" stroke-width="7"/>
    </g>
  </svg>`;
}

function reviewSVG(skin, idx) {
  const bg = ['#f3e9dd','#e9f1ea','#eee6f5','#fdf0e2'][idx % 4];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <rect width="300" height="300" fill="${bg}"/>
    <ellipse cx="150" cy="170" rx="80" ry="100" fill="${skin}"/>
    <rect x="105" y="140" width="45" height="35" rx="8" fill="none" stroke="#2b2b2b" stroke-width="6"/>
    <rect x="150" y="140" width="45" height="35" rx="8" fill="none" stroke="#2b2b2b" stroke-width="6"/>
    <text x="150" y="280" font-size="14" text-anchor="middle" fill="#555" font-family="Georgia">Verified Customer</text>
  </svg>`;
}

const styles = {
  Eyeglasses: ['Round', 'Rectangle', 'Cat Eye', 'Square', 'Aviator', 'Browline'],
  Sunglasses: ['Aviator', 'Round', 'Square', 'Cat Eye', 'Rectangle'],
};

function buildProduct(id, category) {
  const dir = path.join(OUT, String(id));
  const reviewDir = path.join(dir, 'reviews');
  fs.mkdirSync(reviewDir, { recursive: true });

  const color = frameColors[id % frameColors.length];
  const styleList = styles[category] || styles.Eyeglasses;
  const style = styleList[id % styleList.length];
  const gender = ['Men', 'Women', 'Unisex'][id % 3];
  const skin = skinTones[id % skinTones.length];

  const files = [];
  ['_0', '_1', '_2', '_3'].forEach((suffix, i) => {
    const fname = `p${id}${suffix}.svg`;
    fs.writeFileSync(path.join(dir, fname), frameSVG(color, style));
    files.push(`/images/products/${id}/${fname}`);
  });
  ['_m0', '_w0'].forEach((suffix) => {
    const fname = `p${id}${suffix}.svg`;
    fs.writeFileSync(path.join(dir, fname), modelSVG(color, skin, gender));
    files.push(`/images/products/${id}/${fname}`);
  });

  const reviewFiles = [];
  for (let r = 0; r < 4; r++) {
    const fname = `review_${r}.svg`;
    fs.writeFileSync(path.join(reviewDir, fname), reviewSVG(skinTones[(id + r) % skinTones.length], r));
    reviewFiles.push(`/images/products/${id}/reviews/${fname}`);
  }

  return { style, gender, color, mainImage: files[0], images: files, reviewImages: reviewFiles };
}

module.exports = { buildProduct };

if (require.main === module) {
  for (let i = 1; i <= 40; i++) {
    buildProduct(i, i <= 26 ? 'Eyeglasses' : 'Sunglasses');
  }
  console.log('=== Done! Generated placeholder imagery for 40 products. ===');
}
