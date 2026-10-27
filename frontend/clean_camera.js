import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'public/exact_user_camera_transparent.png';
const outputPath = 'public/exact_user_camera_cleaned.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        const a = this.data[idx + 3];

        // The background watermark text consists of very faint grey pixels (R > 230, G > 230, B > 230 with alpha or light color)
        // or nearly pure white background pixels outside the camera.
        if (a > 0 && r >= 232 && g >= 232 && b >= 232) {
          // make it completely transparent
          this.data[idx + 3] = 0;
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log('Cleaned camera saved successfully to', outputPath);
    });
  });
