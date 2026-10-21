import { readFileSync, readdirSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { mechanicPreviews } from './mechanic-previews.mjs';

export const MAX_MECHANIC_IMAGE_EDGE = 1440;
export const MAX_MECHANIC_IMAGE_BYTES = 250 * 1024;

export function isWebP(bytes) {
  return (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  );
}

/** Read WebP, PNG and JPEG dimensions without native build dependencies. */
export function mechanicImageSize(bytes) {
  if (isWebP(bytes)) {
    if (bytes.readUInt32LE(4) + 8 !== bytes.length)
      throw new Error('invalid WebP container length');
    let dimensions;
    let hasImage = false;
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const kind = bytes.toString('ascii', offset, offset + 4);
      const length = bytes.readUInt32LE(offset + 4);
      const start = offset + 8;
      const end = start + length;
      if (end > bytes.length) throw new Error('truncated WebP chunk');
      if (kind === 'VP8X' && length >= 10)
        dimensions = {
          width: bytes.readUIntLE(start + 4, 3) + 1,
          height: bytes.readUIntLE(start + 7, 3) + 1,
        };
      if (kind === 'VP8 ' && length >= 10) {
        if (bytes.readUIntLE(start + 3, 3) !== 0x2a019d)
          throw new Error('invalid WebP frame header');
        hasImage = true;
        dimensions ??= {
          width: bytes.readUInt16LE(start + 6) & 0x3fff,
          height: bytes.readUInt16LE(start + 8) & 0x3fff,
        };
      }
      if (kind === 'VP8L' && length >= 5) {
        if (bytes[start] !== 0x2f)
          throw new Error('invalid WebP lossless header');
        hasImage = true;
        const packed = bytes.readUInt32LE(start + 1);
        dimensions ??= {
          width: (packed & 0x3fff) + 1,
          height: ((packed >>> 14) & 0x3fff) + 1,
        };
      }
      offset = end + (length % 2);
    }
    if (!hasImage || !dimensions) throw new Error('missing WebP image frame');
    return dimensions;
  }
  if (
    bytes.length >= 24 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if (bytes.length < 4 || bytes.readUInt16BE(0) !== 0xffd8)
    throw new Error('expected a WebP, PNG or JPEG screenshot');
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error('invalid JPEG marker');
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) break;
    if (
      [
        0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
        0xcf,
      ].includes(marker) &&
      length >= 7
    )
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5),
      };
    offset += length;
  }
  throw new Error('missing JPEG dimensions');
}

/**
 * Validate authored cards only; the production queue tracks incomplete records.
 * @param {any[]} records
 * @param {Record<string, (typeof mechanicPreviews)[keyof typeof mechanicPreviews]>} [source]
 * @param {string} [publicRoot]
 */
export function validateMechanicPreviews(
  records,
  source = mechanicPreviews,
  publicRoot = resolve('public'),
) {
  const errors = [];
  const active = new Set(
    records
      .filter((r) => r.type === 'mechanic' && r.status === 'active')
      .map((r) => r.id),
  );
  const root = resolve(publicRoot);
  const https = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password;
    } catch {
      return false;
    }
  };
  for (const [id, card] of Object.entries(source)) {
    const error = (message) =>
      errors.push(`mechanic-preview/${id}: ${message}`);
    const localized = (text, name, limit) => {
      for (const lang of ['ru', 'en']) {
        if (typeof text?.[lang] !== 'string' || !text[lang].trim())
          error(`${name}: missing ${lang}`);
        else if (text[lang].length > limit)
          error(`${name}.${lang}: exceeds ${limit} characters`);
      }
    };
    if (!active.has(id)) error('unknown or inactive canonical identity');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(card.updatedAt ?? ''))
      error('missing update date');
    localized(card.title, 'title', 40);
    localized(card.description, 'description', 160);
    const image = card.image;
    if (!image || typeof image !== 'object') {
      error('missing image');
      continue;
    }
    for (const field of ['game', 'credit', 'rights'])
      if (typeof image[field] !== 'string' || !image[field].trim())
        error(`image.${field}: missing`);
    for (const field of ['sourceUrl', 'originalUrl'])
      if (!https(image[field]))
        error(`image.${field}: expected an HTTPS source`);
    localized(image.alt, 'image.alt', 260);
    localized(image.caption, 'image.caption', 80);
    const filename =
      typeof image.src === 'string' ? resolve(root, image.src) : '';
    if (
      !filename.startsWith(root + sep) ||
      !/^images\/mechanics\/[a-z0-9-]+\.webp$/.test(image.src ?? '')
    )
      error('image.src: expected a local WebP mechanic screenshot');
    else {
      try {
        const bytes = readFileSync(filename);
        if (!isWebP(bytes)) error('image file: expected actual WebP format');
        if (bytes.length > MAX_MECHANIC_IMAGE_BYTES)
          error(`image file: exceeds ${MAX_MECHANIC_IMAGE_BYTES} bytes`);
        const actual = mechanicImageSize(bytes);
        if (actual.width !== image.width || actual.height !== image.height)
          error('image dimensions differ from the published file');
        if (Math.max(actual.width, actual.height) > MAX_MECHANIC_IMAGE_EDGE)
          error(`image file: exceeds ${MAX_MECHANIC_IMAGE_EDGE} pixels`);
      } catch (cause) {
        error(`image file: ${cause.message}`);
      }
    }
    const positive = (value) => Number.isInteger(value) && value > 0;
    if (!positive(image.width) || !positive(image.height)) {
      error('invalid image dimensions');
      continue;
    }
    const crop = image.crop ?? {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    };
    if (
      ![crop.x, crop.y].every(
        (value) => Number.isInteger(value) && value >= 0,
      ) ||
      !positive(crop.width) ||
      !positive(crop.height) ||
      crop.x + crop.width > image.width ||
      crop.y + crop.height > image.height
    )
      error('crop is outside the original screenshot');
    if (
      !Array.isArray(image.markers) ||
      image.markers.length < 1 ||
      image.markers.length > 3
    )
      error('expected one to three contextual markers');
    else
      for (const [index, marker] of image.markers.entries()) {
        localized(marker.label, `marker ${index + 1}`, 72);
        // Pixel rectangles include their origin and exclude their far edge.
        if (
          ![marker.x, marker.y].every(Number.isFinite) ||
          marker.x < (crop.x / image.width) * 100 ||
          marker.x >= ((crop.x + crop.width) / image.width) * 100 ||
          marker.y < (crop.y / image.height) * 100 ||
          marker.y >= ((crop.y + crop.height) / image.height) * 100
        )
          error(`marker ${index + 1}: outside the cropped screenshot`);
      }
    if (
      !Array.isArray(card.tips) ||
      card.tips.length < 1 ||
      card.tips.length > 2
    )
      error('expected one or two short tips');
    else card.tips.forEach((tip, i) => localized(tip, `tip ${i + 1}`, 100));
    if (
      !Array.isArray(card.examples) ||
      card.examples.length < 1 ||
      card.examples.length > 2
    )
      error('expected one or two primary example links');
    else
      for (const example of card.examples)
        if (!example.title?.trim() || !https(example.url))
          error('invalid example link');
  }
  for (const filename of readdirSync(resolve(root, 'images/mechanics')))
    if (/\.(?:png|jpe?g|gif|avif)$/i.test(filename))
      errors.push(`mechanic images: ${filename} must be converted to WebP`);
  return errors;
}
