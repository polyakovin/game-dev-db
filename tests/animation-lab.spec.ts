import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { BASE } from '../src/lib/site-config.mjs';

const route = (lang = 'ru') => `${BASE}/${lang}/animation-lab/`;

// A locally authored cuboid with translation animation. No third-party assets.
function fixture(animated = true, resource = '') {
  const positions = new Float32Array([
    -0.5, 0, -0.3, 0.5, 0, -0.3, 0.5, 2, -0.3, -0.5, 2, -0.3, -0.5, 0, 0.3, 0.5,
    0, 0.3, 0.5, 2, 0.3, -0.5, 2, 0.3,
  ]);
  const indices = new Uint16Array([
    0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 0, 1, 5, 0, 5, 4, 3, 7, 6, 3, 6, 2, 0,
    4, 7, 0, 7, 3, 1, 2, 6, 1, 6, 5,
  ]);
  const times = new Float32Array([0, 1, 2]);
  const translations = new Float32Array([0, 0, 0, 2, 0.5, 0, 4, 0, 0]);
  const data = Buffer.concat([
    Buffer.from(positions.buffer),
    Buffer.from(indices.buffer),
    Buffer.from(times.buffer),
    Buffer.from(translations.buffer),
  ]);
  const gltf = {
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: 'Root', mesh: 0 }],
    meshes: [
      {
        primitives: [{ attributes: { POSITION: 0 }, indices: 1, material: 0 }],
      },
    ],
    materials: [
      {
        doubleSided: true,
        pbrMetallicRoughness: {
          baseColorFactor: [0.72, 0.2, 0.07, 1],
          metallicFactor: 0,
          roughnessFactor: 1,
        },
      },
    ],
    buffers: [
      {
        byteLength: data.length,
        uri:
          resource ||
          `data:application/octet-stream;base64,${data.toString('base64')}`,
      },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: positions.byteLength },
      {
        buffer: 0,
        byteOffset: positions.byteLength,
        byteLength: indices.byteLength,
      },
      {
        buffer: 0,
        byteOffset: positions.byteLength + indices.byteLength,
        byteLength: times.byteLength,
      },
      {
        buffer: 0,
        byteOffset:
          positions.byteLength + indices.byteLength + times.byteLength,
        byteLength: translations.byteLength,
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 8,
        type: 'VEC3',
        min: [-0.5, 0, -0.3],
        max: [0.5, 2, 0.3],
      },
      { bufferView: 1, componentType: 5123, count: 36, type: 'SCALAR' },
      {
        bufferView: 2,
        componentType: 5126,
        count: 3,
        type: 'SCALAR',
        min: [0],
        max: [2],
      },
      { bufferView: 3, componentType: 5126, count: 3, type: 'VEC3' },
    ],
    ...(animated
      ? {
          animations: [
            {
              name: 'Translation',
              samplers: [{ input: 2, output: 3, interpolation: 'LINEAR' }],
              channels: [
                { sampler: 0, target: { node: 0, path: 'translation' } },
              ],
            },
          ],
        }
      : {}),
  };
  return {
    name: 'fixture.gltf',
    mimeType: 'model/gltf+json',
    buffer: Buffer.from(JSON.stringify(gltf)),
    data,
  };
}

async function openLab(page: Page, lang = 'ru') {
  await page.goto(route(lang));
  await expect(page.locator('[data-animation-lab]')).toHaveAttribute(
    'data-ready',
    'true',
  );
  await expect(page.locator('[data-app]')).toBeVisible();
}

function glbFixture() {
  const source = fixture();
  const json = JSON.parse(source.buffer.toString());
  delete json.buffers[0].uri;
  const text = Buffer.from(JSON.stringify(json));
  const jsonChunk = Buffer.alloc(Math.ceil(text.length / 4) * 4, 0x20);
  text.copy(jsonChunk);
  const data = Buffer.alloc(Math.ceil(source.data.length / 4) * 4);
  source.data.copy(data);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + data.length, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const dataHeader = Buffer.alloc(8);
  dataHeader.writeUInt32LE(data.length, 0);
  dataHeader.writeUInt32LE(0x004e4942, 4);
  return {
    name: 'fixture.glb',
    mimeType: 'model/gltf-binary',
    buffer: Buffer.concat([header, jsonHeader, jsonChunk, dataHeader, data]),
  };
}

const fbxFixture = {
  name: 'triangle.fbx',
  mimeType: 'application/octet-stream',
  buffer: Buffer.from(`; Original ASCII FBX 7.4 test triangle
FBXHeaderExtension:  {
\tFBXHeaderVersion: 1003
\tFBXVersion: 7400
}
Objects:  {
\tGeometry: 1, "Geometry::Triangle", "Mesh" {
\t\tVertices: *9 {
\t\t\ta: -1,0,0,1,0,0,0,2,0
\t\t}
\t\tPolygonVertexIndex: *3 {
\t\t\ta: 0,1,-3
\t\t}
\t}
\tModel: 2, "Model::Triangle", "Mesh" {
\t\tVersion: 232
\t}
}
Connections:  {
\tC: "OO",1,2
\tC: "OO",2,0
}
`),
};

test('GLB and FBX imports render actual local geometry', async ({ page }) => {
  await openLab(page);
  for (const source of [glbFixture(), fbxFixture]) {
    await page.locator('[data-files]').setInputFiles(source);
    await expect(page.locator('[data-model-name]')).toHaveText(source.name);
    await page.locator('[data-background]').selectOption('transparent');
    await scrub(page, 0);
    expect((await pixels(page)).count).toBeGreaterThan(100);
  }
});

test('optional native Animation Lab model opens without republishing it', async ({
  page,
}, info) => {
  const path = process.env.ANIMATION_LAB_MODEL;
  test.skip(
    !path,
    'Set ANIMATION_LAB_MODEL to verify a local GLB without adding it to the site.',
  );
  await openLab(page);
  await page.locator('[data-files]').setInputFiles(path!);
  await expect(page.locator('[data-clips] option')).toHaveCount(5);
  await page.locator('[data-background]').selectOption('transparent');
  for (let i = 0; i < 5; i++) {
    await page.locator('[data-clips]').selectOption(String(i));
    await scrub(page, 0);
    const image = await pixels(page);
    expect(image.count).toBeGreaterThan(500);
    expect(image.minX).toBeGreaterThan(0);
    expect(image.maxX).toBeLessThan(image.width - 1);
    expect(image.minY).toBeGreaterThan(0);
    expect(image.maxY).toBeLessThan(image.height - 1);
  }
  await page.screenshot({
    path: info.outputPath('native-model.png'),
    fullPage: true,
  });
});
async function scrub(page: Page, time: number) {
  await page
    .locator('[data-timeline]')
    .evaluate((input: HTMLInputElement, value) => {
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, time);
}
async function pixels(page: Page) {
  return page.locator('[data-canvas]').evaluate((source: HTMLCanvasElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(source, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let sumX = 0,
      sumY = 0,
      count = 0,
      minX = canvas.width,
      minY = canvas.height,
      maxX = 0,
      maxY = 0;
    for (let y = 0; y < canvas.height; y += 3)
      for (let x = 0; x < canvas.width; x += 3) {
        const i = (y * canvas.width + x) * 4;
        if (data[i + 3] > 0) {
          sumX += x;
          sumY += y;
          count++;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    return {
      x: sumX / count,
      y: sumY / count,
      count,
      minX,
      minY,
      maxX,
      maxY,
      width: canvas.width,
      height: canvas.height,
    };
  });
}

for (const lang of ['ru', 'en']) {
  test(`Animation Lab renders and switches language: ${lang}`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await openLab(page, lang);
    await expect(page.locator('[data-clips] option')).toHaveCount(3);
    await expect(page.locator('[data-language-switch]')).toHaveAttribute(
      'href',
      route(lang === 'ru' ? 'en' : 'ru'),
    );
    await page.locator('[data-background]').selectOption('transparent');
    await scrub(page, 0.3);
    const image = await pixels(page);
    expect(image.count).toBeGreaterThan(300);
    expect(image.minX).toBeGreaterThan(0);
    expect(image.maxX).toBeLessThan(image.width - 1);
    expect(image.minY).toBeGreaterThan(0);
    expect(image.maxY).toBeLessThan(image.height - 1);
    await page.screenshot({
      path: info.outputPath(`${lang}-desktop.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test('local import, in-place vertical motion, original motion, timeline and loop', async ({
  page,
}) => {
  await openLab(page);
  await page.locator('[data-files]').setInputFiles(fixture());
  await expect(page.locator('[data-model-name]')).toHaveText('fixture.gltf');
  await page.locator('[data-background]').selectOption('transparent');
  await page.locator('[data-loop]').uncheck();
  await scrub(page, 0);
  const start = await pixels(page);
  await scrub(page, 1);
  const middle = await pixels(page);
  expect(Math.abs(start.x - middle.x)).toBeLessThan(2);
  expect(middle.y).toBeLessThan(start.y - 10);
  await page.locator('[data-inplace]').uncheck();
  await scrub(page, 0);
  const movingStart = await pixels(page);
  await scrub(page, 1);
  const movingMiddle = await pixels(page);
  expect(Math.abs(movingStart.x - movingMiddle.x)).toBeGreaterThan(20);
  await page.locator('[data-follow]').check();
  await scrub(page, 0);
  const followStart = await pixels(page);
  await scrub(page, 1);
  const followMiddle = await pixels(page);
  expect(Math.abs(followStart.x - followMiddle.x)).toBeLessThan(2);
  await page.locator('[data-canvas]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-time]')).toHaveText('1.03 / 2.00 s');
  await page.locator('[data-speed]').selectOption('2');
  await scrub(page, 1.9);
  await page.locator('[data-play]').click();
  await expect(page.locator('[data-time]')).toHaveText('2.00 / 2.00 s');
  await expect(page.locator('[data-play]')).toHaveAttribute(
    'aria-label',
    'Воспроизвести',
  );
  await page.locator('[data-loop]').check();
  await scrub(page, 1.95);
  await page.locator('[data-play]').click();
  await expect
    .poll(async () =>
      Number(await page.locator('[data-timeline]').inputValue()),
    )
    .toBeLessThan(1.9);
});

test('failed imports keep the current scene and never request remote resources', async ({
  page,
}) => {
  await openLab(page);
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('invalid.example')) requests.push(request.url());
  });
  for (const file of [
    {
      name: 'broken.glb',
      mimeType: 'model/gltf-binary',
      buffer: Buffer.from('broken'),
    },
    fixture(true, 'missing.bin'),
    fixture(true, 'https://invalid.example/model.bin'),
  ]) {
    await page.locator('[data-files]').setInputFiles(file);
    await expect(page.locator('[data-status]')).toHaveAttribute(
      'data-error',
      'true',
    );
    await expect(page.locator('[data-model-name]')).toHaveText('Демо-робот');
    await expect(page.locator('[data-play]')).toBeEnabled();
  }
  expect(requests).toEqual([]);
  await page.locator('[data-files]').setInputFiles([
    fixture(true, 'model.bin'),
    {
      name: 'model.bin',
      mimeType: 'application/octet-stream',
      buffer: fixture().data,
    },
  ]);
  await expect(page.locator('[data-model-name]')).toHaveText('fixture.gltf');
  await page.locator('[data-files]').setInputFiles(fixture(false));
  await expect(page.locator('[data-play]')).toBeDisabled();
  await expect(page.locator('[data-png]')).toBeEnabled();
  await expect(page.locator('[data-clips]')).toBeDisabled();
});

test('PNG download has full resolution, actual alpha and a visible model', async ({
  page,
}) => {
  await openLab(page);
  await page.locator('[data-background]').selectOption('transparent');
  await expect(page.locator('[data-skeleton]')).toBeDisabled();
  await expect(page.locator('[data-record]')).toBeDisabled();
  await scrub(page, 0.5);
  await page.locator('[data-png]').click();
  await expect(page.locator('[data-download]')).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await page.locator('[data-download]').click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toMatch(/\.png$/);
  const bytes = await readFile((await file.path())!);
  const result = await page.evaluate(async (base64) => {
    const blob = await (await fetch(`data:image/png;base64,${base64}`)).blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(bitmap, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let opaque = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) opaque++;
    return {
      width: bitmap.width,
      height: bitmap.height,
      cornerAlpha: data[3],
      opaque,
    };
  }, bytes.toString('base64'));
  expect(result.width).toBe(1080);
  expect(result.height).toBe(1920);
  expect(result.cornerAlpha).toBe(0);
  expect(result.opaque).toBeGreaterThan(5000);
  expect(result.opaque).toBeLessThan((result.width * result.height) / 2);
});

test('video records a playable silent file and restores the preview', async ({
  page,
}, info) => {
  test.setTimeout(45000);
  await openLab(page, 'en');
  await expect(page.locator('[data-record]')).toBeEnabled();
  await page.locator('[data-duration]').fill('1');
  await page.locator('[data-record]').click();
  await expect(page.locator('[data-status]')).toContainText('Recording');
  await expect(page.locator('[data-background]')).toBeDisabled();
  await expect(page.locator('[data-download]')).toBeVisible({ timeout: 15000 });
  const promise = page.waitForEvent('download');
  await page.locator('[data-download]').click();
  const file = await promise;
  await file.saveAs(info.outputPath(file.suggestedFilename()));
  expect(file.suggestedFilename()).toMatch(/\.(webm|mp4)$/);
  const bytes = await readFile((await file.path())!);
  expect(bytes.length).toBeGreaterThan(1000);
  const metadata = await page.evaluate(async (base64) => {
    const data = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([data]));
    const video = document.createElement('video');
    video.muted = true;
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error('invalid video'));
      video.src = url;
    });
    video.currentTime = 0.2;
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(video, 0, 0);
    const pixel = context.getImageData(
      canvas.width / 2,
      canvas.height / 2,
      1,
      1,
    ).data;
    URL.revokeObjectURL(url);
    return {
      width: video.videoWidth,
      height: video.videoHeight,
      pixel: [...pixel],
    };
  }, bytes.toString('base64'));
  expect(metadata.width).toBe(1080);
  expect(metadata.height).toBe(1920);
  expect(metadata.pixel[3]).toBe(255);
  await expect(page.locator('[data-background]')).toBeEnabled();
});

test('hidden tab interrupts recording and GPU loss offers recovery', async ({
  page,
}) => {
  await openLab(page, 'en');
  await page.locator('[data-duration]').fill('10');
  await page.locator('[data-record]').click();
  await expect(page.locator('[data-status]')).toContainText('Recording');
  // Headless Chromium keeps all tabs visible. Exercise the browser event with
  // its hidden state rather than assuming bringToFront changes visibility.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('[data-status]')).toContainText('interrupted');
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('[data-background]')).toBeEnabled();
  await expect(page.locator('[data-download]')).toBeHidden();
  await page.locator('[data-canvas]').evaluate((canvas: HTMLCanvasElement) => {
    canvas
      .getContext('webgl2')!
      .getExtension('WEBGL_lose_context')!
      .loseContext();
  });
  await expect(page.locator('[data-status]')).toContainText('context lost');
  await expect(page.locator('[data-retry]')).toBeVisible();
  await expect(page.locator('[data-png]')).toBeDisabled();
});

test('mobile, dark theme and keyboard clean preview remain usable', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await openLab(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.locator('[data-canvas]').focus();
  await page.keyboard.press('h');
  await expect(page.locator('[data-animation-lab]')).toHaveAttribute(
    'data-clean',
    'true',
  );
  await page.keyboard.press('Tab');
  await expect(page.locator('.lab-restore')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-animation-lab]')).toHaveAttribute(
    'data-clean',
    'false',
  );
  await page.locator('[data-canvas]').focus();
  await page.keyboard.press('b');
  await page.keyboard.press('w');
  await expect(page.locator('[data-skeleton]')).toBeChecked();
  await expect(page.locator('[data-wireframe]')).toBeChecked();
  await page.locator('[data-clips]').selectOption('1');
  await expect(page.locator('[data-clips]')).toHaveValue('1');
  await page.screenshot({
    path: info.outputPath('ru-mobile-dark.png'),
    fullPage: true,
  });
});

test('no JavaScript, no WebGL and missing recorder have readable fallbacks', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(route());
  await expect(staticPage.locator('.lab-notice')).toContainText('JavaScript');
  await expect(staticPage.locator('[data-app]')).toBeHidden();
  await expect(staticPage.locator('[data-status]')).toBeHidden();
  await expect(staticPage.locator('h1')).toBeVisible();
  await context.close();
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto(route('en'));
  await expect(page.locator('[data-status]')).toContainText('WebGL');
  await expect(page.locator('[data-retry]')).toBeVisible();
  await expect(page.locator('[data-app]')).toBeHidden();
  const noRecorder = await browser.newContext();
  const fallback = await noRecorder.newPage();
  await fallback.addInitScript(() => {
    Object.defineProperty(window, 'MediaRecorder', { value: undefined });
  });
  await openLab(fallback, 'en');
  await expect(fallback.locator('[data-record]')).toBeDisabled();
  await expect(fallback.locator('[data-video-support]')).toContainText(
    'unavailable',
  );
  await expect(fallback.locator('[data-png]')).toBeEnabled();
  await noRecorder.close();
});
