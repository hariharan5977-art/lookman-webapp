import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { resolveProductCode, resolveProductName } from './productUtils';

// Configure worker for browser runtime
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Clean & normalize text strings extracted from PDF tokens
 */
function cleanText(str) {
  return (str || '')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Auto-detect camera category from text context matching Lookman official taxonomy
 */
function detectCategory(text, model) {
  const t = (text + ' ' + model).toUpperCase();
  if (t.includes('PTZ') || t.includes('PAN TILT') || t.includes('SPEED DOME') || t.includes('VPS')) {
    return 'PTZ Cameras';
  }
  if (t.includes('DOME') || t.includes('EYEBALL') || t.includes('TURRET') || t.includes('VD')) {
    if (t.includes('ANALOG') || t.includes('AHD') || t.includes('TVI') || t.includes('CVI') || t.includes('SHD')) {
      return 'HD Analog Cameras';
    }
    return 'HD IP Camera';
  }
  if (t.includes('BULLET') || t.includes('VB')) {
    if (t.includes('ANALOG') || t.includes('AHD') || t.includes('SHD')) {
      return 'HD Analog Cameras';
    }
    return 'HD IP Camera';
  }
  if (t.includes('NVR') || t.includes('NETWORK VIDEO RECORDER') || t.includes('SNVR')) {
    return 'NVRS';
  }
  if (t.includes('DVR') || t.includes('DIGITAL VIDEO RECORDER') || t.includes('XVR') || t.includes('HYBRID')) {
    return 'Hybrid DVR';
  }
  if (t.includes('ANALOG') || t.includes('AHD') || t.includes('TVI') || t.includes('SHD')) {
    return 'HD Analog Cameras';
  }
  if (t.includes('ACCESS CONTROL') || t.includes('BIOMETRIC') || t.includes('FACE RECOGNITION') || t.includes('ATTENDANCE')) {
    return 'AI Product';
  }
  if (t.includes('SWITCH') || t.includes('POE SWITCH')) {
    return 'Switch';
  }
  return 'HD IP Camera';
}

/**
 * Removes solid white/light background from an image canvas using flood-fill from edges
 * and crops tightly around the product, returning a clean transparent PNG data URI.
 */
function removeImageBackgroundAndCrop(sourceCanvas, tolerance = 38) {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  if (w <= 10 || h <= 10) return null;

  const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 1. Sample border pixels to detect background color
  const samplePoints = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
    [Math.floor(w * 0.25), 0], [Math.floor(w * 0.75), 0]
  ];

  let totalR = 0, totalG = 0, totalB = 0;
  let opaqueCount = 0;
  let transparentBorderCount = 0;

  for (const [x, y] of samplePoints) {
    const idx = (y * w + x) * 4;
    const a = data[idx + 3];
    if (a < 35) {
      transparentBorderCount++;
    } else {
      totalR += data[idx];
      totalG += data[idx + 1];
      totalB += data[idx + 2];
      opaqueCount++;
    }
  }

  // Helper to crop tightly around non-transparent pixels
  const cropTight = () => {
    let minX = w, maxX = 0, minY = h, maxY = 0;
    let nonBgPixelCount = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 25) {
          nonBgPixelCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (nonBgPixelCount > 150 && minX < maxX && minY < maxY && (maxX - minX > 25) && (maxY - minY > 25)) {
      const pad = 6;
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
    return null;
  };

  // If borders are already transparent (authentic camera PNG cutout), crop directly!
  if (transparentBorderCount >= 4) {
    const directCrop = cropTight();
    if (directCrop) return directCrop;
  }

  const bgR = opaqueCount > 0 ? Math.round(totalR / opaqueCount) : 255;
  const bgG = opaqueCount > 0 ? Math.round(totalG / opaqueCount) : 255;
  const bgB = opaqueCount > 0 ? Math.round(totalB / opaqueCount) : 255;

  // 2. BFS flood-fill from all 4 outer borders to clear background
  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h * 2);
  let qStart = 0;
  let qEnd = 0;

  const isBgPixel = (r, g, b, a) => {
    if (a < 35) return true;
    const brightness = (r + g + b) / 3;
    if (brightness >= 215) return true;
    if (r >= 210 && g >= 210 && b >= 210) return true;
    const d = Math.max(Math.abs(r - bgR), Math.abs(g - bgG), Math.abs(b - bgB));
    return d <= tolerance;
  };

  for (let x = 0; x < w; x++) {
    queue[qEnd++] = x; queue[qEnd++] = 0;
    queue[qEnd++] = x; queue[qEnd++] = h - 1;
  }
  for (let y = 1; y < h - 1; y++) {
    queue[qEnd++] = 0; queue[qEnd++] = y;
    queue[qEnd++] = w - 1; queue[qEnd++] = y;
  }

  while (qStart < qEnd) {
    const x = queue[qStart++];
    const y = queue[qStart++];
    const pos = y * w + x;
    if (visited[pos]) continue;
    visited[pos] = 1;

    const idx = pos * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (isBgPixel(r, g, b, a)) {
      data[idx + 3] = 0; // Make background transparent

      if (x > 0 && !visited[pos - 1]) { queue[qEnd++] = x - 1; queue[qEnd++] = y; }
      if (x < w - 1 && !visited[pos + 1]) { queue[qEnd++] = x + 1; queue[qEnd++] = y; }
      if (y > 0 && !visited[pos - w]) { queue[qEnd++] = x; queue[qEnd++] = y - 1; }
      if (y < h - 1 && !visited[pos + w]) { queue[qEnd++] = x; queue[qEnd++] = y + 1; }
    }
  }

  // 3. Anti-aliasing pass along border edges
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const pos = y * w + x;
      const idx = pos * 4;
      if (data[idx + 3] > 0) {
        const hasTransparentNeighbor = 
          data[(pos - 1) * 4 + 3] === 0 || 
          data[(pos + 1) * 4 + 3] === 0 || 
          data[(pos - w) * 4 + 3] === 0 || 
          data[(pos + w) * 4 + 3] === 0;

        if (hasTransparentNeighbor) {
          const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          if (brightness >= 205) {
            const factor = Math.max(0, Math.min(1, (255 - brightness) / 50));
            data[idx + 3] = Math.round(255 * factor);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 4. Calculate tight bounding box to crop product alone
  return cropTight();
}

/**
 * Resolve an image object asynchronously from PDF.js objects collection using callback
 */
function resolvePdfImage(page, imgName) {
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (obj) => {
      if (!resolved) {
        resolved = true;
        resolve(obj);
      }
    };
    try {
      if (page.objs) {
        page.objs.get(imgName, (obj) => finish(obj));
      }
      if (page.commonObjs && !resolved) {
        page.commonObjs.get(imgName, (obj) => finish(obj));
      }
    } catch {
      finish(null);
    }
    setTimeout(() => finish(null), 1800);
  });
}

/**
 * Converts resolved PDF image object into an HTMLCanvasElement
 */
function imgObjToCanvas(imgObj) {
  if (!imgObj || !imgObj.width || !imgObj.height) return null;
  const canvas = document.createElement('canvas');
  canvas.width = imgObj.width;
  canvas.height = imgObj.height;
  const ctx = canvas.getContext('2d');

  if (imgObj.bitmap || (typeof ImageBitmap !== 'undefined' && imgObj instanceof ImageBitmap)) {
    ctx.drawImage(imgObj.bitmap || imgObj, 0, 0);
    return canvas;
  }
  if (imgObj instanceof HTMLImageElement || imgObj instanceof HTMLCanvasElement) {
    ctx.drawImage(imgObj, 0, 0);
    return canvas;
  }
  if (imgObj.data) {
    let imgData = null;
    const len = imgObj.data.length;
    const totalPixels = imgObj.width * imgObj.height;
    if (len === totalPixels * 4) {
      imgData = new ImageData(new Uint8ClampedArray(imgObj.data), imgObj.width, imgObj.height);
    } else if (len === totalPixels * 3) {
      const rgba = new Uint8ClampedArray(totalPixels * 4);
      let j = 0;
      for (let k = 0; k < len; k += 3) {
        rgba[j++] = imgObj.data[k];
        rgba[j++] = imgObj.data[k + 1];
        rgba[j++] = imgObj.data[k + 2];
        rgba[j++] = 255;
      }
      imgData = new ImageData(rgba, imgObj.width, imgObj.height);
    } else if (len === totalPixels) {
      const rgba = new Uint8ClampedArray(totalPixels * 4);
      let j = 0;
      for (let k = 0; k < len; k++) {
        const v = imgObj.data[k];
        rgba[j++] = v;
        rgba[j++] = v;
        rgba[j++] = v;
        rgba[j++] = 255;
      }
      imgData = new ImageData(rgba, imgObj.width, imgObj.height);
    }
    if (imgData) {
      ctx.putImageData(imgData, 0, 0);
      return canvas;
    }
  }
  return null;
}

/**
 * Auto-detect camera image asset as high-definition fallback
 */
export function autoDetectProductImage(model = '', category = '') {
  const m = (model || '').toUpperCase();
  const c = (category || '').toUpperCase();
  if (m.includes('TURRET') || m.includes('2D') || m.includes('EYEBALL') || m.includes('DOME')) {
    return '/color_on_turret_hd.png';
  }
  if (m.includes('BULLET') || m.includes('2B') || m.includes('CO-H')) {
    return '/color_on_bullet_hd.png';
  }
  if (m.includes('VPS') || m.includes('PTZ') || c.includes('PTZ')) {
    return '/color_on_ptz_dome.png';
  }
  if (m.includes('SNVR') || m.includes('NVR') || c.includes('NVR')) {
    return '/color_on_nvr_chassis.png';
  }
  if (m.includes('XVR') || m.includes('DVR') || c.includes('DVR') || c.includes('HYBRID')) {
    return '/color_on_xvr_chassis.png';
  }
  return '/color_on_bullet_hd.png';
}

/**
 * Extract isolated product camera image alone without background from PDF page
 */
async function extractIsolatedProductImage(page) {
  try {
    // 1. Extract embedded raster image XObjects if present in PDF
    const operatorList = await page.getOperatorList();
    const imageNames = [];

    for (let i = 0; i < operatorList.fnArray.length; i++) {
      const fn = operatorList.fnArray[i];
      if (fn === pdfjsLib.OPS.paintImageXObject || 
          fn === pdfjsLib.OPS.paintInlineImageXObject ||
          fn === pdfjsLib.OPS.paintImageMaskXObject) {
        const imgName = operatorList.argsArray[i]?.[0];
        if (imgName && !imageNames.includes(imgName)) {
          imageNames.push(imgName);
        }
      }
    }

    if (imageNames.length > 0) {
      const candidateCanvases = [];
      for (const name of imageNames) {
        const imgObj = await resolvePdfImage(page, name);
        if (imgObj && imgObj.width && imgObj.height) {
          const w = imgObj.width;
          const h = imgObj.height;
          // Filter out full-page backgrounds (e.g. 1125x1500) and tiny icons (< 110x110)
          const isFullPage = w >= 850 && h >= 1100;
          const isTinyIcon = w < 110 && h < 110;
          if (!isFullPage && !isTinyIcon) {
            const c = imgObjToCanvas(imgObj);
            if (c) {
              candidateCanvases.push(c);
            }
          }
        }
      }

      if (candidateCanvases.length > 0) {
        // Sort descending by area among legitimate camera candidates
        candidateCanvases.sort((a, b) => (b.width * b.height) - (a.width * a.height));
        for (const candidate of candidateCanvases) {
          const isolated = removeImageBackgroundAndCrop(candidate, 38);
          if (isolated) return isolated;
        }
      }
    }

    // 2. High-res page render with visual product region isolation fallback
    const viewport = page.getViewport({ scale: 2.0 });
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = viewport.width;
    pageCanvas.height = viewport.height;
    const pageCtx = pageCanvas.getContext('2d', { willReadFrequently: true });

    await page.render({
      canvasContext: pageCtx,
      viewport: viewport
    }).promise;

    // In CCTV datasheets, the camera product photo is located in the upper showcase area
    const showcaseY = Math.round(viewport.height * 0.08);
    const showcaseH = Math.round(viewport.height * 0.44);
    const showcaseW = viewport.width;

    const showcaseCanvas = document.createElement('canvas');
    showcaseCanvas.width = showcaseW;
    showcaseCanvas.height = showcaseH;
    const showcaseCtx = showcaseCanvas.getContext('2d');
    showcaseCtx.drawImage(pageCanvas, 0, showcaseY, showcaseW, showcaseH, 0, 0, showcaseW, showcaseH);

    return removeImageBackgroundAndCrop(showcaseCanvas, 38);
  } catch (err) {
    console.warn('Product image extraction notice:', err);
    return null;
  }
}

/**
 * Helper to find field value by searching key patterns in table lines or fallback regex
 */
function findField(lines, fullText, keyPatterns, valueRegexFallback, defaultValue = '') {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    for (const pat of keyPatterns) {
      // Inline e.g. "Image Sensor: 1/2.8 Progressive Scan CMOS"
      const inlineMatch = line.match(new RegExp(`^(?:${pat})\\s*[:\\-–—]?\\s*(.+)`, 'i'));
      if (inlineMatch && inlineMatch[1]) {
        let val = cleanText(inlineMatch[1].replace(/^[:\-–—]\s*/, ''));
        if (val.length > 1 && !keyPatterns.some(p => new RegExp(`^${p}\\s*[:\\-]?$`, 'i').test(val))) {
          return val;
        }
      }
      // Table cells e.g. line i is "Image Sensor", line i+1 is "1/2.8 Progressive Scan CMOS"
      const keyOnlyMatch = line.match(new RegExp(`^(?:${pat})\\s*[:\\-–—]?$`, 'i'));
      if (keyOnlyMatch && i + 1 < lines.length) {
        const nextVal = cleanText(lines[i + 1]);
        if (nextVal.length > 1 && !nextVal.includes(':')) {
          return nextVal;
        }
      }
    }
  }

  if (valueRegexFallback) {
    const match = fullText.match(valueRegexFallback);
    if (match && (match[1] || match[0])) {
      return cleanText(match[1] || match[0]);
    }
  }

  return defaultValue;
}

/**
 * Extract structured specification details from lines of text - ONLY THESE FIELDS
 */
function extractSpecsFromLines(lines, fallbackModel = '') {
  const fullText = lines.join('\n');
  const lowerFull = fullText.toLowerCase();

  // 1. Resolution
  const resolution = findField(
    lines,
    fullText,
    ['Max\\.?\\s*Resolution', 'Video\\s*Resolution', 'Resolution', 'Effective\\s*Pixels', 'Image\\s*Resolution'],
    /(\d+\s*(?:MP|Megapixel)|4K\s*(?:Ultra\s*HD)?|1080P\s*(?:Full\s*HD)?|720P|2K|3MP|4MP|5MP|6MP|8MP)/i,
    lowerFull.includes('4k') ? '4K Ultra HD (8MP)' :
    lowerFull.includes('5mp') ? '5MP Super HD' :
    lowerFull.includes('4mp') ? '4MP Super HD' :
    lowerFull.includes('2mp') || lowerFull.includes('1080p') ? '2MP 1080P Full HD' : '1080P Full HD'
  );

  // 2. Sensor
  const sensor = findField(
    lines,
    fullText,
    ['Image\\s*Sensor', 'Sensor\\s*Type', 'Sensor', 'Pickup\\s*Device', 'Optics'],
    /(1\/\d(?:\.\d+)?["”]?\s*(?:Progressive\s*Scan\s*)?(?:CMOS|CCD|STARVIS|Sony[^\n\r,]*))/i,
    lowerFull.includes('starvis') ? '1/2.8" STARVIS Low Light CMOS' : '1/2.8" Progressive Scan CMOS'
  );

  // 3. Night Vision
  const nightVision = findField(
    lines,
    fullText,
    ['IR\\s*Distance', 'Night\\s*Vision', 'Illuminat(?:or|ion)', 'IR\\s*Range', 'Smart\\s*IR', 'White\\s*Light\\s*Distance'],
    /(Smart\s*IR\s*(?:up\s*to\s*)?\d+\s*m|Laser\s*IR\s*\d+\s*m|Color\s*Night\s*Vision[^\n\r,]*|IR\s*(?:up\s*to\s*)?\d+\s*m)/i,
    lowerFull.includes('color night vision') || lowerFull.includes('full-color') ? 'Full Color Night Vision 24/7' : 'Smart IR Night Vision 30m'
  );

  // 4. Audio
  const audio = findField(
    lines,
    fullText,
    ['Audio(?:\s*In\/?Out|\s*Interface|\s*Compression)?', 'Microphone', 'Two-way\s*Audio', 'Audio\\s*Input', 'Built-in\\s*Mic', 'Mic'],
    /(Two-way\s*Audio|Built-in\s*Mic(?:rophone)?|Audio\s*Input|1\s*Audio\s*In)/i,
    lowerFull.includes('two-way') ? 'Two-Way Audio with Built-in Mic & Speaker' : 'Built-in Mic & Audio Output'
  );

  // 5. Power
  const power = findField(
    lines,
    fullText,
    ['Power\\s*Supply', 'Operating\\s*Power', 'Power\\s*Consumption', 'Power', 'Voltage', 'PoE'],
    /(PoE\+?|12V\s*DC|24V\s*AC|Power\s*over\s*Ethernet)/i,
    'PoE (Power over Ethernet) / 12V DC'
  );

  // 6. Casing
  const casing = findField(
    lines,
    fullText,
    ['Ingress\\s*Protection', 'Protection(?:\s*Level)?', 'IP\\s*Rating', 'Housing', 'Casing', 'Enclosure', 'Material'],
    /(IP6[5-8](?:\s*Weatherproof)?|IK10(?:\s*Vandal-proof)?|Weatherproof\s*Metal\s*Housing)/i,
    'IP66 Weatherproof Aluminum Housing'
  );

  // 7. Description
  let description = findField(
    lines,
    fullText,
    ['Overview', 'Product\\s*Overview', 'Features', 'Key\\s*Features', 'Description'],
    null,
    ''
  );

  if (!description) {
    const featureLines = lines.filter(l => 
      l.length > 20 && 
      (l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || 
       /^(high|smart|supports|efficient|clear|water|built|advanced|color|panoramic)/i.test(l))
    );
    if (featureLines.length > 0) {
      description = featureLines.slice(0, 3).map(l => l.replace(/^[•\-\*]\s*/, '')).join('. ') + '.';
    } else {
      const summaryLine = lines.find(l => l.length > 35 && !l.includes(':'));
      if (summaryLine) {
        description = cleanText(summaryLine);
      } else {
        description = `${fallbackModel || 'High performance'} security camera offering ${resolution} video with ${nightVision}.`;
      }
    }
  }

  return {
    resolution,
    sensor,
    nightVision,
    audio,
    power,
    casing,
    description
  };
}

/**
 * Primary PDF Datasheet Parser for Lookman Admin Panel
 * Fetches:
 * - Product image alone without any background (transparent PNG)
 * - The one line of the image / title
 * - All text extracted from the PDF (model, specs, description, fullText)
 * @param {File} file - Browser File object (.pdf)
 * @returns {Promise<Array<Object>>} Extracted product objects ready for Admin preview & DB persistence
 */
export async function parsePdfDatasheet(file) {
  if (!file) throw new Error('No PDF file provided');

  const arrayBuffer = await file.arrayBuffer();

  // Read base64 data URL for retention & direct viewing
  const pdfBase64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    isEvalSupported: false
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const fileNameBase = file.name.replace(/\.[^/.]+$/, '').trim();
  const pagesData = [];

  // 1. Extract text and isolate clean product images without background from each page
  for (let pageNum = 1; pageNum <= Math.min(numPages, 20); pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by Y position to reconstruct natural lines
    const lineMap = new Map();
    for (const item of textContent.items) {
      if (!item.str || !item.str.trim()) continue;
      const y = Math.round((item.transform ? item.transform[5] : 0) / 4) * 4;
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y).push(item.str);
    }

    // Sort descending by Y (top of page down to bottom)
    const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);
    const lines = sortedY.map(y => cleanText(lineMap.get(y).join(' '))).filter(Boolean);

    // Isolate product image alone without any background
    const pageImage = await extractIsolatedProductImage(page);

    pagesData.push({
      pageNum,
      lines,
      fullText: lines.join('\n'),
      pageImage
    });
  }

  // 2. Identify products in the extracted content
  const detectedProducts = [];

  const isModelCode = (str) => {
    if (!str || str.length < 3 || str.length > 35) return false;
    const clean = str.replace(/[^A-Za-z0-9\-_/()]/g, '');
    if (!/[0-9]/.test(clean) || !/[A-Za-z]/.test(clean)) return false;
    return /^(?:CO-|CO_|SIP|SHD|SNVR|SXVR|DS-|CP-|IPC-|NVR-|XVR-|HAC-|DH-|LK-|LM-|CCTV|CAM)/i.test(clean) ||
           /^[A-Z]{2,4}[-_][A-Z0-9\-_()]{3,20}$/i.test(clean);
  };

  const findExplicitModel = (lines, defaultName) => {
    // 1. Check for Color On model code pattern anywhere in the lines
    for (const line of lines) {
      const coMatch = line.match(/\b(CO-[A-Za-z0-9\-_()]{4,25})\b/i);
      if (coMatch && coMatch[1]) {
        return cleanText(coMatch[1]);
      }
    }
    // 2. Check for explicit Model: labels
    for (const line of lines) {
      const match = line.match(/(?:Model(?:\s*No\.?|\s*Number)?|Item(?:\s*Code)?|Part\s*Number|P\/N|Product\s*Code)\s*[:\-–—]?\s*([A-Za-z0-9\-_/()]+)/i);
      if (match && match[1]) {
        return cleanText(match[1]);
      }
    }
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      const words = lines[i].split(/\s+/);
      for (const w of words) {
        if (isModelCode(w)) return w.replace(/[:,\(\)]/g, '').trim();
      }
    }
    if (isModelCode(fileNameBase)) {
      return fileNameBase;
    }
    return defaultName;
  };

  // Helper to find the prominent "one line of the image / title"
  const findOneLineTitle = (lines, model, category, resolution) => {
    const isBrandOrHeader = (low) => 
      low.includes('surveillance systems') ||
      low.includes('advanced surveillance') ||
      low.includes('company') ||
      low.includes('corporation') ||
      low.includes('pvt ltd') ||
      low.includes('limited') ||
      low.includes('datasheet') ||
      low.startsWith('model') ||
      low.startsWith('product model') ||
      low.startsWith('category') ||
      low.startsWith('specs') ||
      low.startsWith('specification') ||
      low.startsWith('part no') ||
      low.startsWith('max.') ||
      low.startsWith('effective pixels');

    // 1st pass: Look for lines containing camera/ptz/dome/bullet/nvr/dvr that ALSO contain model or resolution or optical zoom
    for (const l of lines.slice(0, 25)) {
      const low = l.toLowerCase();
      if (l.length >= 15 && l.length <= 110 && !isBrandOrHeader(low)) {
        if ((low.includes('camera') || low.includes('ptz') || low.includes('dome') || low.includes('bullet') || low.includes('speed dome') || low.includes('nvr') || low.includes('dvr')) &&
            (low.includes('4k') || low.includes('mp') || low.includes('hd') || low.includes('zoom') || (model && low.includes(model.toLowerCase())))) {
          return cleanText(l);
        }
      }
    }

    // 2nd pass: Any camera/hardware headline line
    for (const l of lines.slice(0, 25)) {
      const low = l.toLowerCase();
      if (l.length >= 15 && l.length <= 110 && !isBrandOrHeader(low)) {
        if (low.includes('camera') || low.includes('speed dome') || low.includes('ptz') || low.includes('bullet') || low.includes('dome') || low.includes('nvr') || low.includes('dvr')) {
          return cleanText(l);
        }
      }
    }

    return `${model} - ${resolution} ${category} Surveillance Hardware`;
  };

  let hasMultipleDistinctModels = false;
  const pageModels = pagesData.map((p) => findExplicitModel(p.lines, ''));
  const uniqueModels = Array.from(new Set(pageModels.filter(Boolean)));
  if (uniqueModels.length > 1 && uniqueModels.length >= pagesData.length * 0.7) {
    hasMultipleDistinctModels = true;
  }

  if (hasMultipleDistinctModels) {
    pagesData.forEach((p, idx) => {
      const model = pageModels[idx] || `${fileNameBase} - Item ${idx + 1}`;
      const category = detectCategory(p.fullText, model);
      const specs = extractSpecsFromLines(p.lines, model);
      const oneLineTitle = findOneLineTitle(p.lines, model, category, specs.resolution);
      const imageToUse = p.pageImage || autoDetectProductImage(model, category);
      const code = resolveProductCode({ model, title: oneLineTitle, description: specs.description, category });
      const resolvedName = resolveProductName({ model, title: oneLineTitle });

      detectedProducts.push({
        id: `pdf_${Date.now()}_${idx}`,
        model: code,
        productCode: code,
        name: resolvedName,
        title: oneLineTitle, // The one line of the image / product
        category,
        image: imageToUse, // Product image alone without background (transparent PNG)
        resolution: specs.resolution,
        sensor: specs.sensor,
        nightVision: specs.nightVision,
        audio: specs.audio,
        power: specs.power,
        casing: specs.casing,
        description: specs.description,
        fullText: p.fullText, // All the text fetched from the page
        rawImageGiven: p.pageImage ? `Transparent Product PNG (Page ${p.pageNum})` : `Lookman Render (${code})`,
        imageSource: p.pageImage ? 'pdf_transparent' : 'default_render',
        hasImage: Boolean(imageToUse),
        datasheetPdf: pdfBase64,
        datasheetPdfName: file.name,
        sourceType: 'pdf_datasheet',
        price: 0
      });
    });
  } else {
    const combinedLines = pagesData.flatMap(p => p.lines);
    const combinedText = combinedLines.join('\n');
    const model = findExplicitModel(combinedLines, fileNameBase);
    const category = detectCategory(combinedText, model);
    const specs = extractSpecsFromLines(combinedLines, model);
    const oneLineTitle = findOneLineTitle(combinedLines, model, category, specs.resolution);
    const primaryImage = pagesData[0]?.pageImage || '';
    const imageToUse = primaryImage || autoDetectProductImage(model, category);
    const code = resolveProductCode({ model: model || fileNameBase, title: oneLineTitle, description: specs.description, category });
    const resolvedName = resolveProductName({ model: model || fileNameBase, title: oneLineTitle });

    detectedProducts.push({
      id: `pdf_${Date.now()}_0`,
      model: code,
      productCode: code,
      name: resolvedName,
      title: oneLineTitle, // The one line of the image / product
      category,
      image: imageToUse, // Product image alone without background (transparent PNG)
      resolution: specs.resolution,
      sensor: specs.sensor,
      nightVision: specs.nightVision,
      audio: specs.audio,
      power: specs.power,
      casing: specs.casing,
      description: specs.description,
      fullText: combinedText, // All the text fetched from the PDF
      rawImageGiven: primaryImage ? `${file.name} (Isolated Transparent Product)` : `Lookman Render (${code})`,
      imageSource: primaryImage ? 'pdf_transparent' : 'default_render',
      hasImage: Boolean(imageToUse),
      datasheetPdf: pdfBase64,
      datasheetPdfName: file.name,
      sourceType: 'pdf_datasheet',
      price: 0
    });
  }

  return detectedProducts;
}
