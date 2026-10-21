import {
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  mechanicImageSize,
  isWebP,
  MAX_MECHANIC_IMAGE_EDGE,
  MAX_MECHANIC_IMAGE_BYTES,
} from '../src/lib/mechanic-preview-validation.mjs';

/** Scale crop edges once, keeping the source's half-open rectangle contract. */
export function resizeMechanicCrop(crop, before, after) {
  const x = Math.round((crop.x / before.width) * after.width);
  const y = Math.round((crop.y / before.height) * after.height);
  const right = Math.round(
    ((crop.x + crop.width) / before.width) * after.width,
  );
  const bottom = Math.round(
    ((crop.y + crop.height) / before.height) * after.height,
  );
  if (right <= x || bottom <= y)
    throw new Error('crop collapses after resizing');
  return { x, y, width: right - x, height: bottom - y };
}

export function optimizeMechanicImages({ write = false } = {}) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const filename = join(root, 'src/data/mechanic-previews.json');
  const cards = JSON.parse(readFileSync(filename, 'utf8'));
  const assets = new Map();
  for (const { image } of Object.values(cards)) {
    if (!assets.has(image.src)) assets.set(image.src, []);
    assets.get(image.src).push(image);
  }
  const work = mkdtempSync(join(tmpdir(), 'gddb-webp-'));
  let beforeBytes = 0;
  let afterBytes = 0;
  let changed = 0;
  const prepared = [];
  try {
    for (const [src, images] of assets) {
      if (!/^images\/mechanics\/[a-z0-9-]+\.(?:png|jpe?g|webp)$/.test(src))
        throw new Error(`Unsupported source path: ${src}`);
      const input = join(root, 'public', src);
      const bytes = readFileSync(input);
      const before = mechanicImageSize(bytes);
      beforeBytes += bytes.length;
      if (
        isWebP(bytes) &&
        Math.max(before.width, before.height) <= MAX_MECHANIC_IMAGE_EDGE &&
        bytes.length <= MAX_MECHANIC_IMAGE_BYTES
      ) {
        afterBytes += bytes.length;
        continue;
      }
      const destination = src.replace(/\.(?:png|jpe?g|webp)$/, '.webp');
      const output = join(root, 'public', destination);
      if (output !== input && existsSync(output))
        throw new Error(`Destination already exists: ${destination}`);
      const temporary = join(work, `${changed}.webp`);
      let edge = Math.min(
        MAX_MECHANIC_IMAGE_EDGE,
        Math.max(before.width, before.height),
      );
      let encoded;
      for (;;) {
        const scale = edge / Math.max(before.width, before.height);
        const width = Math.max(1, Math.round(before.width * scale));
        const height = Math.max(1, Math.round(before.height * scale));
        for (const quality of [82, 76, 70]) {
          const run = spawnSync(
            'cwebp',
            [
              '-quiet',
              '-m',
              '6',
              '-q',
              String(quality),
              '-metadata',
              'none',
              '-resize',
              String(width),
              String(height),
              input,
              '-o',
              temporary,
            ],
            { encoding: 'utf8' },
          );
          if (run.error) throw run.error;
          if (run.status !== 0)
            throw new Error(`cwebp failed for ${src}: ${run.stderr}`);
          encoded = readFileSync(temporary);
          if (encoded.length <= MAX_MECHANIC_IMAGE_BYTES) break;
        }
        if (encoded.length <= MAX_MECHANIC_IMAGE_BYTES) break;
        edge = Math.floor(edge * 0.85);
        if (edge < 640) throw new Error(`Cannot meet image budget: ${src}`);
      }
      const after = mechanicImageSize(encoded);
      for (const image of images) {
        if (image.crop)
          image.crop = resizeMechanicCrop(image.crop, before, after);
        image.src = destination;
        image.width = after.width;
        image.height = after.height;
      }
      prepared.push({ input, output, encoded });
      afterBytes += encoded.length;
      changed++;
      console.log(
        `${src} → ${destination}: ${before.width}×${before.height} → ${after.width}×${after.height}, ${Math.round(bytes.length / 1024)} → ${Math.round(encoded.length / 1024)} KiB`,
      );
    }
    if (write) {
      for (const { output, encoded } of prepared)
        writeFileSync(output, encoded);
      writeFileSync(filename, JSON.stringify(cards, null, 2) + '\n');
      for (const { input, output } of prepared)
        if (input !== output) unlinkSync(input);
    }
    console.log(
      `${write ? 'Optimized' : 'Preview'}: ${changed}/${assets.size} images; ${Math.round(beforeBytes / 1024)} → ${Math.round(afterBytes / 1024)} KiB${write ? '' : ' (use --write to apply)'}`,
    );
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  optimizeMechanicImages({ write: process.argv.includes('--write') });
