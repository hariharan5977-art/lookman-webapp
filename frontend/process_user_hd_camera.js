import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'C:/Users/LOOKMAN/.gemini/antigravity-ide/brain/92beaac4-8337-4a48-898a-08cf196a78a7/.user_uploaded/media_1788419717566.png';
const outputPath = 'public/exact_user_camera_cleaned.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const visited = new Uint8Array(w * h);

    // 1. BFS flood fill outer white background (threshold >= 238)
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

      this.data[cidx + 3] = 0; // Transparent

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

            // Outer white space
            const isWhiteBg = na === 0 || (nr >= 238 && ng >= 238 && nb >= 238);

            if (isWhiteBg) {
              visited[nPos] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    // 2. Find connected components of non-visited pixels (the main camera body vs speckles)
    const compVisited = new Uint8Array(w * h);
    const components = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const pos = y * w + x;
        if (!visited[pos] && !compVisited[pos]) {
          const comp = [];
          const q = [x, y];
          compVisited[pos] = 1;
          let qHead = 0;

          while (qHead < q.length) {
            const px = q[qHead++];
            const py = q[qHead++];
            comp.push((py * w + px));

            const nbs = [
              [px + 1, py],
              [px - 1, py],
              [px, py + 1],
              [px, py - 1]
            ];

            for (const [nx, ny] of nbs) {
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const nP = ny * w + nx;
                if (!visited[nP] && !compVisited[nP]) {
                  compVisited[nP] = 1;
                  q.push(nx, ny);
                }
              }
            }
          }

          components.push(comp);
        }
      }
    }

    // Sort components by size: the largest one is the camera assembly
    components.sort((a, b) => b.length - a.length);

    // Keep the main large component(s) (length > 500), make all tiny speckles transparent
    components.forEach((comp, idx) => {
      if (comp.length < 500) {
        comp.forEach(p => {
          this.data[(p << 2) + 3] = 0;
        });
      } else {
        comp.forEach(p => {
          this.data[(p << 2) + 3] = 255;
        });
      }
    });

    this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log('Spotless HD camera cutout saved to', outputPath);
    });
  });
