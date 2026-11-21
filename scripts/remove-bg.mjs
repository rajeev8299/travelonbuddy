import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'C:/Users/rajee/.gemini/antigravity/brain/f8167d33-7ba7-4807-a508-6c1faa378e66/.user_uploaded/media_1794809259496_cf90c82b.jpg';
const outputDir = 'D:/new project travellonbuddy/public';
const outputPath = path.join(outputDir, 'logo.png');

async function removeBlackBackground() {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

  // Get raw RGBA buffer
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Flood fill / threshold outer black background starting from edges
  // The outer background is pitch black (#000000 or near black r,g,b < 25)
  // Let's do a breadth-first search (BFS) flood fill from corners (0,0), (width-1, 0), etc.
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBackground(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Black threshold: since background is pure black #000000 with slight compression noise
    return r < 30 && g < 30 && b < 30;
  }

  // Push all border pixels that are black to the queue
  for (let x = 0; x < width; x++) {
    if (isBackground(x, 0)) { visited[0 * width + x] = 1; queue.push(x, 0); }
    if (isBackground(x, height - 1)) { visited[(height - 1) * width + x] = 1; queue.push(x, height - 1); }
  }
  for (let y = 0; y < height; y++) {
    if (isBackground(0, y)) { visited[y * width + 0] = 1; queue.push(0, y); }
    if (isBackground(width - 1, y)) { visited[y * width + (width - 1)] = 1; queue.push(width - 1, y); }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos] && isBackground(nx, ny)) {
          visited[nPos] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Now set alpha to 0 for all visited pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      if (visited[pos]) {
        const idx = pos * 4;
        data[idx + 3] = 0; // Transparent
      }
    }
  }

  // Smooth anti-aliased edges (feathering 1px boundary)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = y * width + x;
      if (!visited[pos]) {
        // check if adjacent to visited
        const isEdge = visited[pos - 1] || visited[pos + 1] || visited[pos - width] || visited[pos + width];
        if (isEdge) {
          const idx = pos * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          // If dark edge transition, blend alpha
          if (r < 50 && g < 50 && b < 50) {
            data[idx + 3] = Math.max(0, Math.min(255, (r + g + b) * 1.5));
          }
        }
      }
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log('Saved transparent logo to', outputPath);
}

removeBlackBackground().catch(err => {
  console.error(err);
  process.exit(1);
});
