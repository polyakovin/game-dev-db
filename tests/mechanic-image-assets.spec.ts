import { expect, test } from '@playwright/test';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  mechanicImageSize,
  MAX_MECHANIC_IMAGE_BYTES,
  validateMechanicPreviews,
} from '../src/lib/mechanic-preview-validation.mjs';
import { mechanicPreviews } from '../src/lib/mechanic-previews.mjs';
import { buildKnowledge } from '../src/lib/knowledge.mjs';
import { resizeMechanicCrop } from '../scripts/optimize-mechanic-images.mjs';

function webp(kind: string, payload: Buffer) {
  const bytes = Buffer.alloc(20 + payload.length + (payload.length % 2));
  bytes.write('RIFF', 0);
  bytes.writeUInt32LE(bytes.length - 8, 4);
  bytes.write('WEBP', 8);
  bytes.write(kind, 12);
  bytes.writeUInt32LE(payload.length, 16);
  payload.copy(bytes, 20);
  return bytes;
}

test('WebP dimensions support lossy, lossless and extended containers', () => {
  const lossy = Buffer.alloc(10);
  lossy.writeUIntLE(0x2a019d, 3, 3);
  lossy.writeUInt16LE(1440, 6);
  lossy.writeUInt16LE(810, 8);
  expect(mechanicImageSize(webp('VP8 ', lossy))).toEqual({
    width: 1440,
    height: 810,
  });
  const lossless = Buffer.alloc(5);
  lossless[0] = 0x2f;
  lossless.writeUInt32LE(639 | (479 << 14), 1);
  expect(mechanicImageSize(webp('VP8L', lossless))).toEqual({
    width: 640,
    height: 480,
  });
  const canvas = Buffer.alloc(10);
  canvas.writeUIntLE(1439, 4, 3);
  canvas.writeUIntLE(809, 7, 3);
  const extended = Buffer.concat([
    webp('VP8X', canvas),
    webp('VP8 ', lossy).subarray(12),
  ]);
  extended.writeUInt32LE(extended.length - 8, 4);
  expect(mechanicImageSize(extended)).toEqual({ width: 1440, height: 810 });
  expect(() => mechanicImageSize(extended.subarray(0, -1))).toThrow(/length/);
  expect(() => mechanicImageSize(webp('VP8X', canvas))).toThrow(/frame/);
});

test('resizing preserves crop edges, including the full-image far edge', () => {
  expect(
    resizeMechanicCrop(
      { x: 350, y: 0, width: 1450, height: 1080 },
      { width: 1920, height: 1080 },
      { width: 1440, height: 810 },
    ),
  ).toEqual({ x: 263, y: 0, width: 1087, height: 810 });
  expect(
    resizeMechanicCrop(
      { x: 1, y: 1, width: 1919, height: 1079 },
      { width: 1920, height: 1080 },
      { width: 1224, height: 689 },
    ),
  ).toEqual({ x: 1, y: 1, width: 1223, height: 688 });
});

test('publication rejects oversized WebP and leftover source raster files', () => {
  const root = mkdtempSync(join(tmpdir(), 'gddb-image-test-'));
  const id = 'shared-family-02';
  const entry = structuredClone(mechanicPreviews[id]);
  const records = buildKnowledge([], 'ru', []).records;
  try {
    mkdirSync(join(root, 'images/mechanics'), { recursive: true });
    const bytes = readFileSync(join('public', entry.image.src));
    writeFileSync(join(root, entry.image.src), bytes);
    expect(validateMechanicPreviews(records, { [id]: entry }, root)).toEqual(
      [],
    );
    const oversized = Buffer.alloc(MAX_MECHANIC_IMAGE_BYTES + 2);
    bytes.copy(oversized);
    oversized.writeUInt32LE(oversized.length - 8, 4);
    writeFileSync(join(root, entry.image.src), oversized);
    expect(
      validateMechanicPreviews(records, { [id]: entry }, root).join('\n'),
    ).toMatch(/exceeds .* bytes/);
    writeFileSync(
      join(root, 'images/mechanics/original.jpg'),
      Buffer.from('unused'),
    );
    expect(
      validateMechanicPreviews(records, { [id]: entry }, root).join('\n'),
    ).toMatch(/original.jpg must be converted/);
    writeFileSync(join(root, entry.image.src), Buffer.from('not a WebP'));
    expect(
      validateMechanicPreviews(records, { [id]: entry }, root).join('\n'),
    ).toMatch(/expected actual WebP/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
