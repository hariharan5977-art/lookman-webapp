/**
 * Utility to extract camera from uploaded image, eliminate solid white / light square backgrounds,
 * and tightly crop the camera silhouette, returning 100% transparent PNG data URLs using HTML5 Canvas.
 */

function cropCanvasToContent(sourceCanvas, pad = 6) {
  try {
    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    if (w <= 10 || h <= 10) return sourceCanvas.toDataURL('image/png');

    const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let minX = w, maxX = 0, minY = h, maxY = 0;
    let nonBgCount = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const a = data[idx + 3];
        if (a > 20) {
          nonBgCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (nonBgCount > 100 && minX < maxX && minY < maxY && (maxX - minX > 20) && (maxY - minY > 20)) {
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.min(w - cropX, (maxX - minX) + pad * 2);
      const cropH = Math.min(h - cropY, (maxY - minY) + pad * 2);

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(sourceCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      return cropCanvas.toDataURL('image/png');
    }
  } catch (err) {
    console.warn('cropCanvasToContent notice:', err);
  }
  return sourceCanvas.toDataURL('image/png');
}

export function removeWhiteBackgroundFromImage(imageSource, options = {}) {
  const {
    threshold = 210,      // Pixel brightness/channel threshold to consider background (195-245)
    feather = true,        // Smooth anti-aliased edge
    maxDimension = 1200    // Resize safeguard
  } = options;

  return new Promise((resolve) => {
    if (!imageSource) {
      return resolve(imageSource);
    }

    // If running in an environment without DOM/Canvas (e.g. SSR), fallback gracefully
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve(imageSource);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          return resolve(imageSource);
        }

        // Downscale if exorbitantly huge
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(imageSource);

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Sample perimeter points to detect background color
        const samplePoints = [
          [0, 0],
          [width - 1, 0],
          [0, height - 1],
          [width - 1, height - 1],
          [Math.floor(width / 2), 0],
          [Math.floor(width / 2), height - 1],
          [0, Math.floor(height / 2)],
          [width - 1, Math.floor(height / 2)],
          [Math.floor(width * 0.25), 0],
          [Math.floor(width * 0.75), 0]
        ];

        let totalR = 0, totalG = 0, totalB = 0;
        let opaqueBorderSamples = 0;
        let transparentBorderCount = 0;

        for (const [sx, sy] of samplePoints) {
          const sIdx = (sy * width + sx) * 4;
          const sa = data[sIdx + 3];
          if (sa < 40) {
            transparentBorderCount++;
          } else {
            totalR += data[sIdx];
            totalG += data[sIdx + 1];
            totalB += data[sIdx + 2];
            opaqueBorderSamples++;
          }
        }

        // If borders are already fully transparent, just crop tightly to remove dead square space
        if (transparentBorderCount >= 6) {
          return resolve(cropCanvasToContent(canvas, 4));
        }

        const bgR = opaqueBorderSamples > 0 ? Math.round(totalR / opaqueBorderSamples) : 255;
        const bgG = opaqueBorderSamples > 0 ? Math.round(totalG / opaqueBorderSamples) : 255;
        const bgB = opaqueBorderSamples > 0 ? Math.round(totalB / opaqueBorderSamples) : 255;

        // BFS Flood-fill from outer perimeter to identify connected background
        const visited = new Uint8Array(width * height);
        const queue = [];

        // Seed all border pixels
        for (let x = 0; x < width; x++) {
          queue.push(x, 0); visited[x] = 1;
          queue.push(x, height - 1); visited[(height - 1) * width + x] = 1;
        }
        for (let y = 0; y < height; y++) {
          queue.push(0, y); visited[y * width] = 1;
          queue.push(width - 1, y); visited[y * width + (width - 1)] = 1;
        }

        const bgThreshold = Math.min(threshold, 215);

        let head = 0;
        while (head < queue.length) {
          const cx = queue[head++];
          const cy = queue[head++];
          const cidx = (cy * width + cx) * 4;

          data[cidx + 3] = 0; // Turn background 100% transparent

          const nbs = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
          ];

          for (let i = 0; i < 4; i++) {
            const nx = nbs[i][0];
            const ny = nbs[i][1];
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nPos = ny * width + nx;
              if (!visited[nPos]) {
                const idx = nPos * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];
                const brightness = (r + g + b) / 3;
                const colorDist = Math.max(Math.abs(r - bgR), Math.abs(g - bgG), Math.abs(b - bgB));

                // Connected white, off-white, or already transparent outer pixel
                if (a < 40 || brightness >= bgThreshold || colorDist <= 42 || (r >= bgThreshold - 20 && g >= bgThreshold - 20 && b >= bgThreshold - 20)) {
                  visited[nPos] = 1;
                  queue.push(nx, ny);
                }
              }
            }
          }
        }

        // Edge feathering to eliminate harsh white halo
        if (feather) {
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const pos = y * width + x;
              if (!visited[pos] && data[pos * 4 + 3] > 0) {
                const hasTransparentNeighbor = 
                  data[(pos - 1) * 4 + 3] === 0 || 
                  data[(pos + 1) * 4 + 3] === 0 || 
                  data[(pos - width) * 4 + 3] === 0 || 
                  data[(pos + width) * 4 + 3] === 0;

                if (hasTransparentNeighbor) {
                  const idx = pos * 4;
                  const r = data[idx];
                  const g = data[idx + 1];
                  const b = data[idx + 2];
                  const brightness = (r + g + b) / 3;
                  if (brightness >= 210) {
                    const factor = Math.max(0, Math.min(1, (255 - brightness) / 45));
                    data[idx + 3] = Math.round(255 * factor);
                  }
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        // Tightly crop camera content alone so no square bounds remain
        const croppedTransparentDataUrl = cropCanvasToContent(canvas, 6);
        resolve(croppedTransparentDataUrl);
      } catch (err) {
        console.warn('Transparent camera extraction notice:', err);
        resolve(imageSource);
      }
    };

    img.onerror = () => {
      resolve(imageSource);
    };

    // Support File/Blob input
    if (typeof imageSource === 'object' && imageSource instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(imageSource);
      reader.readAsDataURL(imageSource);
    } else {
      img.src = imageSource;
    }
  });
}

