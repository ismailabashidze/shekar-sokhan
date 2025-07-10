import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const svgPath = join(publicDir, 'app-icon.svg');

async function generateFavicon() {
  console.log('🔍 Generating favicon...');
  
  try {
    const svgBuffer = readFileSync(svgPath);
    
    // Generate favicon.png (32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png({ quality: 90 })
      .toFile(join(publicDir, 'favicon.png'));
    
    console.log('✅ Generated favicon.png (32x32)');
    
    // Generate favicon.ico equivalent (16x16)
    await sharp(svgBuffer)
      .resize(16, 16)
      .png({ quality: 90 })
      .toFile(join(publicDir, 'favicon-16x16.png'));
    
    console.log('✅ Generated favicon-16x16.png');
    
    console.log('🎉 Favicon generation completed!');
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
  }
}

generateFavicon(); 