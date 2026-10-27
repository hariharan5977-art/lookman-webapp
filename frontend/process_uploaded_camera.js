import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'C:/Users/LOOKMAN/.gemini/antigravity-ide/brain/92beaac4-8337-4a48-898a-08cf196a78a7/.tempmediaStorage/media_1788419142907.png';
const outputPath = 'public/exact_user_camera_cleaned.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const visited = new Uint8Array(w * h);

    // BFS Queue for outer white background flood fill starting from all 4 borders
    const queue = [];

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

            // Outer white background is very light (r, g, b > 230) or transparent
            const isWhiteBg = na === 0 || (nr >= 235 && ng >= 235 && nb >= 235);

            if (isWhiteBg) {
              visited[nPos] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    // Ensure all internal camera pixels are 100% solid (a = 255)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pos = y * w + x;
        if (!visited[pos]) {
          const idx = pos << 2;
          this.data[idx + 3] = 255;
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log('Successfully processed uploaded camera into transparent solid image:', outputPath);
    });
  });
