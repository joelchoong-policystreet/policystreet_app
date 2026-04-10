/**
 * One-off: convert welcome logo raster to PNG with alpha (flat background removed).
 * Source may be mislabeled .png but contain JPEG data.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Flat-background JPEG from design; replace when the welcome logo updates. */
const src = join(
  root,
  'scripts/assets/onboarding-welcome-logo-source.jpg',
);
const out = join(root, 'public/assets/onboarding-welcome-logo.png');

async function main() {
  const input = sharp(readFileSync(src));
  const { data, info } = await input.ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const { width, height, channels } = info;
  const buf = new Uint8ClampedArray(data);

  // Sample top-left background colour (flat canvas typical for logo exports)
  const bgR = buf[0];
  const bgG = buf[1];
  const bgB = buf[2];

  const threshold = 38; // tolerance in RGB space

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = buf[i];
      const g = buf[i + 1];
      const b = buf[i + 2];
      const dr = r - bgR;
      const dg = g - bgG;
      const db = b - bgB;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist <= threshold) {
        buf[i + 3] = 0;
      } else {
        buf[i + 3] = 255;
      }
    }
  }

  await sharp(buf, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toFile(out);

  console.log('Wrote', out, `${width}x${height}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
