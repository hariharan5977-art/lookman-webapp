import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'public/exact_user_camera_transparent.png';
const outputPath = 'public/exact_user_camera_cleaned.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const visited = new Uint8Array(w * h);

    // BFS Queue for outer background flood fill
    const queue = [];

    // Push all 4 outer borders into the queue
    for (let x = 0; x < w; x++) {
      queue.push(x, 0);
      queue.push(x, h - 1);
      visited[x] = 1;
      visited[(h - 1) * w + x] = 1;
    }
    for (let y = 0; y < h; y++) {
      queue.push(0, y);
      queue.push(w - 1, y);
      visited[y * w] = 1;
      visited[y * w + (w - 1)] = 1;
    }

    let head = 0;
    while (head < queue.length) {
      const cx = queue[head++];
      const cy = queue[head++];
      const cidx = (cy * w + cx) << 2;

      // Make background pixel completely transparent
      this.data[cidx + 3] = 0;

      // Check 4 neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nPos = ny * w + nx;
          if (!visited[nPos]) {
            const nidx = nPos << 2;
            const nr = this.data[nidx];
            const ng = this.data[nidx + 1];
            const nb = this.data[nidx + 2];
            const na = this.data[nidx + 3];

            // Background pixels are either already transparent (na === 0)
            // or very light faint watermark text (R > 220, G > 220, B > 220)
            // The camera edges are dark (lens hoods, metal brackets, shading: R < 200 or distinct colors)
            const isLightBg = na === 0 || (nr >= 225 && ng >= 225 && nb >= 225);

            if (isLightBg) {
              visited[nPos] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    // Restore any interior pixels that were never reached by the outer flood fill
    // Ensure all camera body pixels have full opacity (a = 255)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pos = y * w + x;
        if (!visited[pos]) {
          const idx = pos << 2;
          this.data[idx + 3] = 255; // 100% solid opacity inside the camera body!
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log('Cleaned camera with 100% solid body saved to', outputPath);
    });
  });
