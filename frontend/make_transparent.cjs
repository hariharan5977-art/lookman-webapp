const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage(inputPath, outputPath) {
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelArray = new Uint8ClampedArray(data.buffer);
    const len = info.width * info.height * 4;

    for (let i = 0; i < len; i += 4) {
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];

      // Convert any white or near-white background pixel to 100% transparent alpha (0)
      if (r > 215 && g > 215 && b > 215) {
        pixelArray[i + 3] = 0;
      }
    }

    await sharp(Buffer.from(pixelArray.buffer), {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    console.log(`Successfully generated pure transparent PNG: ${outputPath}`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

async function run() {
  const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\e7230024-cf94-4b13-8388-38fae8c32dd2';
  const publicDir = path.join(__dirname, 'public');

  // Slide 1: Bullet Camera
  await processImage(
    path.join(brainDir, 'bullet_camera_product_1787568421404.png'),
    path.join(publicDir, 'bullet_camera_transparent.png')
  );

  // Slide 2: PTZ Camera
  await processImage(
    path.join(brainDir, 'secura_ptz_camera_1787569912876.png'),
    path.join(publicDir, 'secura_ptz_transparent.png')
  );
}

run();
