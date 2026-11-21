import sharp from 'sharp';

async function sampleColors() {
  const image = sharp('D:/new project travellonbuddy/public/logo.png');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const colorCounts = {};

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue; // skip transparent
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Quantize by 8
    const qr = Math.round(r / 8) * 8;
    const qg = Math.round(g / 8) * 8;
    const qb = Math.round(b / 8) * 8;

    const hex = '#' + [qr, qg, qb].map(x => x.toString(16).padStart(2, '0')).join('');
    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
  }

  const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, 30);
  console.log('Top sampled colors:');
  for (const [hex, count] of sorted) {
    console.log(`${hex}: ${count}`);
  }
}

sampleColors().catch(console.error);
