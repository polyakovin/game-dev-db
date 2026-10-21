import { expect, test } from '@playwright/test';
import { buildKnowledge, knowledgeMarkdown } from '../src/lib/knowledge.mjs';
import { getMechanicPreview } from '../src/lib/mechanic-previews.mjs';

const base = '/game-dev-db';
const id = 'shared-family-02';
const route = (lang: string) => `${base}/${lang}/knowledge/mechanic/${id}/`;

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
    for (const viewport of [
      { width: 1280, height: 720 },
      { width: 1440, height: 900 },
      { width: 375, height: 667 },
      { width: 390, height: 844 },
    ]) {
      test(`${lang} ${colorScheme} ${viewport.width}×${viewport.height}: whole mechanic fits without scrolling or clipping`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme });
        await page.goto(route(lang));
        await page.evaluate(() => document.fonts.ready);
        const image = page.locator('.preview-image img');
        await expect(image).toBeVisible();
        await expect(image).toHaveJSProperty('naturalWidth', 2048);
        await expect(page.locator('.preview-marker')).toHaveCount(2);
        await expect(page.locator('.preview-tips li')).toHaveCount(2);
        const layout = await page.evaluate(() => {
          const root = document.documentElement;
          const article = document.querySelector('[data-mechanic-preview]')!;
          return {
            width: root.scrollWidth,
            height: root.scrollHeight,
            bottom: article.getBoundingClientRect().bottom,
            scrollers: [...article.querySelectorAll('*')]
              .filter((el) => {
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
        await expect(page.locator('.preview-footer a').last()).toBeInViewport();
      });
    }
  }

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
