import { expect, test } from '@playwright/test';
import { buildKnowledge, knowledgeMarkdown } from '../src/lib/knowledge.mjs';
import { getMechanicPreview } from '../src/lib/mechanic-previews.mjs';

const base = '/game-dev-db';
const id = 'shared-family-02';
const route = (lang: string) => `${base}/${lang}/knowledge/mechanic/${id}/`;
const viewports = [
  { width: 319, height: 849 },
  { width: 320, height: 500 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 400, height: 500 },
  { width: 516, height: 314 },
  { width: 600, height: 600 },
  { width: 700, height: 500 },
  { width: 800, height: 500 },
  { width: 1024, height: 600 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1510, height: 900 },
  { width: 1920, height: 1080 },
];

test('pilot adds bilingual presentation while preserving shared identity and full taxonomy', () => {
  for (const lang of ['ru', 'en']) {
    const records = buildKnowledge([], lang, []).records;
    const record = records.find((r: any) => r.key === `mechanic/${id}`)!;
    expect(records.filter((r: any) => r.attributes.preview)).toHaveLength(1);
    expect(record.placements.map((p: any) => p.catalogId)).toEqual([
      'children',
      'education',
    ]);
    expect(
      record.sections.find((s: any) => s.id === 'variants').body,
    ).toContain('family-02-variant-10');
    const preview = getMechanicPreview(id, lang)!;
    const crop = preview.image.crop!;
    expect(crop.x + crop.width).toBeLessThanOrEqual(preview.image.width);
    expect(crop.y + crop.height).toBeLessThanOrEqual(preview.image.height);
    for (const marker of preview.image.markers) {
      expect((marker.x / 100) * preview.image.width).toBeGreaterThan(crop.x);
      expect((marker.x / 100) * preview.image.width).toBeLessThan(
        crop.x + crop.width,
      );
      expect((marker.y / 100) * preview.image.height).toBeGreaterThan(crop.y);
      expect((marker.y / 100) * preview.image.height).toBeLessThan(
        crop.y + crop.height,
      );
    }
    expect(record.summary).toBe(preview.description);
    expect(record.attributes.preview).toEqual(preview);
    const markdown = knowledgeMarkdown(record);
    expect(markdown).toContain(preview.description);
    expect(markdown).toContain(preview.image.sourceUrl);
    for (const tip of preview.tips) expect(markdown).toContain(tip);
    for (const source of preview.examples)
      expect(record.sources.some((s: any) => s.url === source.url)).toBe(true);
  }
});

for (const lang of ['ru', 'en'] as const) {
  for (const colorScheme of ['light', 'dark'] as const) {
    for (const viewport of viewports) {
      test(`${lang} ${colorScheme} ${viewport.width}×${viewport.height}: whole mechanic fits without scrolling or clipping`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme });
        await page.goto(route(lang));
        await page.evaluate(() => document.fonts.ready);
        const image = page.locator('.preview-image img');
        await expect(image).toBeVisible();
        await expect(image).toHaveJSProperty('naturalWidth', 2048);
        await expect(page.locator('.preview-marker')).toHaveCount(2);
        await expect(page.locator('.preview-categories a')).toHaveCount(2);
        const layout = await page.evaluate(() => {
          const root = document.documentElement;
          const article = document.querySelector('[data-mechanic-preview]')!;
          return {
            width: root.scrollWidth,
            height: root.scrollHeight,
            bottom: article.getBoundingClientRect().bottom,
            main: document
              .querySelector('main')!
              .getBoundingClientRect()
              .toJSON(),
            frame: document
              .querySelector('.preview-viewport')!
              .getBoundingClientRect()
              .toJSON(),
            image: document
              .querySelector('.preview-image')!
              .getBoundingClientRect()
              .toJSON(),
            scrollers: [...article.querySelectorAll('*')]
              .filter((el) => {
                if (el.closest('[data-image-crop]')) return false;
                const css = getComputedStyle(el);
                return (
                  (el.scrollHeight > el.clientHeight + 1 &&
                    /auto|scroll|hidden|clip/.test(css.overflowY)) ||
                  (el.scrollWidth > el.clientWidth + 1 &&
                    /auto|scroll|hidden|clip/.test(css.overflowX))
                );
              })
              .map((el) => el.className),
          };
        });
        expect(layout.width).toBeLessThanOrEqual(viewport.width);
        expect(layout.height).toBeLessThanOrEqual(viewport.height);
        expect(layout.bottom).toBeLessThanOrEqual(viewport.height);
        expect(layout.scrollers).toEqual([]);
        expect(layout.main.width).toBeGreaterThanOrEqual(viewport.width - 1);
        expect(layout.main.bottom).toBeGreaterThanOrEqual(viewport.height - 1);
        // The screenshot fills the available frame on at least one axis.
        expect(
          Math.max(
            layout.image.width / layout.frame.width,
            layout.image.height / layout.frame.height,
          ),
        ).toBeGreaterThan(0.98);
        expect(layout.image.height).toBeGreaterThan(70);
        await expect(page.locator('.preview-description')).toBeInViewport({
          ratio: 1,
        });
        for (const marker of await page.locator('.preview-marker').all())
          await expect(marker).toBeInViewport({ ratio: 1 });
        await expect(page.locator('.preview-footer a').last()).toBeInViewport();
        if (
          lang === 'ru' &&
          colorScheme === 'dark' &&
          [319, 516, 1510].includes(viewport.width)
        )
          await page.screenshot({
            path: testInfo.outputPath(
              `viewport-${viewport.width}x${viewport.height}.png`,
            ),
            fullPage: true,
          });
      });
    }
  }

  test(`${lang}: resizing through breakpoints preserves the required content and viewport fit`, async ({
    page,
  }) => {
    await page.goto(route(lang));
    await page.evaluate(() => document.fonts.ready);
    for (const width of [479, 480, 515, 600, 700, 739, 740, 800, 900, 1024]) {
      await page.setViewportSize({ width, height: 500 });
      const dimensions = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      }));
      expect(dimensions, `${width}×500`).toEqual({ width, height: 500 });
      await expect(page.locator('.preview-description')).toBeInViewport({
        ratio: 1,
      });
      await expect(page.locator('.preview-credit')).toBeInViewport({
        ratio: 1,
      });
    }
  });

  test(`${lang}: both categories open the same pilot without JavaScript; full exports and language link resolve`, async ({
    browser,
    baseURL,
    request,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
    });
    const page = await context.newPage();
    for (const catalog of ['children', 'education']) {
      await page.goto(`${base}/${lang}/mechanics/${catalog}/`);
      await page.locator('[data-mechanic-preview-link]').click();
      await expect(page).toHaveURL(new RegExp(`${route(lang)}$`));
      await expect(page.locator('.preview-categories a')).toHaveCount(2);
      await expect(page.locator('.preview-description')).toBeVisible();
    }
    const payload = await (
      await request.get(`${base}/api/v1/knowledge/${lang}/mechanic/${id}.json`)
    ).json();
    const preview = payload.record.attributes.preview;
    expect(await page.locator('.preview-description').textContent()).toBe(
      preview.description,
    );
    const markdown = await (
      await request.get(`${base}/content/knowledge/${lang}/mechanic/${id}.md`)
    ).text();
    for (const tip of preview.tips) expect(markdown).toContain(tip);
    expect(markdown).toContain('family-02-variant-10');
    await page.locator('[data-language-switch]').click();
    await expect(page).toHaveURL(
      new RegExp(`${route(lang === 'ru' ? 'en' : 'ru')}$`),
    );
    await context.close();
  });

  test(`${lang}: enlarged text keeps all content reachable and keyboard links visible`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(route(lang));
    await page.addStyleTag({ content: 'body { zoom: 2; }' });
    await expect(page.locator('.preview-tips')).toBeVisible();
    const lastLink = page.locator('.preview-footer a').last();
    await lastLink.focus();
    await expect(lastLink).toBeFocused();
    await expect(lastLink).toBeInViewport();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(375);
  });
}
