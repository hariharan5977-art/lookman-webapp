const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

function makeTransparent(inputPath, outputPath) {
  fs.createReadStream(inputPath)
    .pipe(new PNG())
    .on('parsed', function() {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let idx = (this.width * y + x) << 2;
          let r = this.data[idx];
          let g = this.data[idx + 1];
          let b = this.data[idx + 2];

          // If pixel is white or near-white background, set alpha to 0 (100% transparent)
          if (r > 220 && g > 220 && b > 220) {
            this.data[idx + 3] = 0;
          }
        }
      }

      this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
        console.log(`Saved transparent image: ${outputPath}`);
      });
    });
}

const publicDir = path.join(__dirname, 'public');

makeTransparent(
  path.join(publicDir, 'bullet_camera_product.png'),
  path.join(publicDir, 'bullet_camera_product.png')
);

makeTransparent(
  path.join(publicDir, 'secura_ptz_camera.png'),
  path.join(publicDir, 'secura_ptz_camera.png')
);
