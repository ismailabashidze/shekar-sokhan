import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const svgPath = join(publicDir, 'app-icon.svg');

// Read the SVG file
const svgBuffer = readFileSync(svgPath);

// Generate different sizes
const sizes = [192, 512];

async function generateIcons() {
  console.log('🎨 Generating PWA icons...');
  
  for (const size of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(publicDir, `pwa-${size}x${size}.png`));
      
      console.log(`✅ Generated pwa-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generating ${size}x${size} icon:`, error);
    }
  }
  
  console.log('🎉 PWA icons generated successfully!');
}

generateIcons().catch(console.error); 