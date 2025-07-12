const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if ImageMagick is installed
function checkImageMagick() {
  try {
    execSync('convert --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('ImageMagick not found. Please install it first:');
    console.log('macOS: brew install imagemagick');
    console.log('Ubuntu: sudo apt-get install imagemagick');
    console.log('Windows: Download from https://imagemagick.org/');
    return false;
  }
}

// Optimize images to WebP format
function optimizeImages() {
  const photosDir = path.join(__dirname, '../public/Photos');
  const files = fs.readdirSync(photosDir);
  
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file) && 
    !file.includes('optimized') &&
    !file.includes('.DS_Store')
  );
  
  console.log('Found images to optimize:', imageFiles);
  
  imageFiles.forEach(file => {
    const inputPath = path.join(photosDir, file);
    const outputPath = path.join(photosDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    try {
      // Convert to WebP with quality 80
      execSync(`convert "${inputPath}" -quality 80 "${outputPath}"`);
      
      // Get file sizes
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${file} -> ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')} (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Failed to optimize ${file}:`, error.message);
    }
  });
}

// Main execution
if (require.main === module) {
  if (!checkImageMagick()) {
    process.exit(1);
  }
  
  console.log('🚀 Starting image optimization...');
  optimizeImages();
  console.log('✅ Image optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Update image references in your code to use .webp files');
  console.log('2. Consider using <picture> elements for fallback support');
  console.log('3. Test the performance improvement');
} 