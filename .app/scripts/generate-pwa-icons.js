import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const svgPath = join(publicDir, 'app-icon.svg');

console.log('🔍 Checking paths...');
console.log('Public dir:', publicDir);
console.log('SVG path:', svgPath);
console.log('SVG exists:', existsSync(svgPath));

// Read the SVG file
let svgBuffer;
try {
  svgBuffer = readFileSync(svgPath);
  console.log('✅ SVG file read successfully, size:', svgBuffer.length, 'bytes');
} catch (error) {
  console.error('❌ Error reading SVG file:', error.message);
  process.exit(1);
}

// Generate different sizes
const sizes = [192, 512];
const faviconSizes = [16, 32];

async function generateIcons() {
  console.log('🎨 Generating PWA icons...');
  
  for (const size of sizes) {
    try {
      const outputPath = join(publicDir, `pwa-${size}x${size}.png`);
      console.log(`🔄 Generating ${size}x${size} to:`, outputPath);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png({
          quality: 90,
          compressionLevel: 9
        })
        .toFile(outputPath);
      
      console.log(`✅ Generated pwa-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generating ${size}x${size} icon:`, error.message);
      console.error('Stack:', error.stack);
    }
  }
  
  console.log('🔍 Generating favicons...');
  
  for (const size of faviconSizes) {
    try {
      const filename = size === 32 ? 'favicon.png' : `favicon-${size}x${size}.png`;
      const outputPath = join(publicDir, filename);
      console.log(`🔄 Generating favicon ${size}x${size} to:`, outputPath);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png({
          quality: 90,
          compressionLevel: 9
        })
        .toFile(outputPath);
      
      console.log(`✅ Generated ${filename}`);
    } catch (error) {
      console.error(`❌ Error generating favicon ${size}x${size}:`, error.message);
    }
  }
  
  console.log('🎉 PWA icons and favicons generated successfully!');
}

generateIcons().catch(console.error); 