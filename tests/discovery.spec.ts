import { expect, test } from '@playwright/test';
import { load } from 'cheerio';

const base = '/game-dev-db';
for (const lang of ['ru', 'en'] as const) {
  for (const type of ['mechanic', 'practice', 'lens']) {
    test(`${lang}/${type}: focused record is readable without scripts and has matching citation metadata`, async ({
      browser,
      request,
      baseURL,
    }, testInfo) => {
      const index = await (
        await request.get(`${base}/api/v1/knowledge/${lang}/index.json`)
      ).json();
      const entry = index.records.find((r: any) => r.type === type);
      const { record } = await (
        await request.get(new URL(entry.jsonUrl).pathname)
      ).json();
      const context = await browser.newContext({
        javaScriptEnabled: false,
        baseURL,
        viewport: { width: 375, height: 812 },
      });
      const page = await context.newPage();
      await page.goto(new URL(record.url).pathname);
      await expect(page.locator('h1')).toHaveText(record.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        record.url,
      );
      await expect(page.locator('link[type="text/markdown"]')).toHaveAttribute(
        'href',
        record.markdownUrl,
      );
      await expect(
        page.locator('link[title="Knowledge record"]'),
      ).toHaveAttribute('href', record.jsonUrl);
      const metadata = JSON.parse(
        (await page
          .locator('script[type="application/ld+json"]')
          .textContent()) ?? '{}',
      );
      expect(metadata.name).toBe(record.title);
      expect(metadata.citation).toEqual(record.sources.map((s: any) => s.url));
      expect(metadata.dateModified ?? null).toBe(record.updatedAt);
      expect(
        await page
          .locator('[data-record-section]')
          .evaluateAll((items) => items.map((item) => item.id)),
      ).toEqual(record.sections.map((s: any) => s.id));
      await expect(page.locator('#collections a').first()).toHaveAttribute(
        'href',
        new URL(record.placements[0].url).pathname +
          new URL(record.placements[0].url).hash,
      );
      await expect(page.locator('[data-language-switch]')).toHaveAttribute(
        'href',
        new URL(record.url).pathname.replace(
          `/${lang}/`,
          `/${lang === 'ru' ? 'en' : 'ru'}/`,
        ),
      );
      for (const colorScheme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
        if (type === 'mechanic')
          await page.screenshot({
            path: testInfo.outputPath(`${lang}-${colorScheme}-mobile.png`),
          });
      }
      // Native TOC is usable by keyboard without any client script.
      await page.setViewportSize({ width: 1280, height: 900 });
      await expect(page.locator('[data-toc] a').first()).toBeVisible();
      if (type === 'mechanic')
        await page.screenshot({
          path: testInfo.outputPath(`${lang}-desktop.png`),
        });
      await page.locator('[data-toc] a').first().focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new RegExp(`#${record.sections[0].id}$`));
      await context.close();
    });
  }

  test(`${lang}: agent entry points support bounded retrieval and both copy actions`, async ({
    page,
    request,
    context,
  }) => {
    const topic = await request.get(`${base}/llms/${lang}.txt`);
    expect(topic.ok()).toBe(true);
    expect(await topic.text()).toContain(`api/v1/knowledge/${lang}/index.json`);
    const snippet = await (
      await request.get(`${base}/agent-instructions/${lang}.md`)
    ).text();
    expect(snippet).toContain(`llms/${lang}.txt`);
    expect(snippet).toContain('jsonUrl');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`${base}/${lang}/for-agents/`);
    for (const selector of ['#agent-prompt', '#repository-instructions']) {
      await page.locator(`[data-copy-target="${selector}"]`).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        await page.locator(selector).textContent(),
      );
    }
  });
}

test('sitemap contains unique focused pages, matching language pairs and actual editorial dates', async ({
  request,
}) => {
  const sitemap = await request.get(`${base}/sitemap.xml`);
  const $ = load(await sitemap.text(), { xmlMode: true });
  const urls = $('url > loc')
    .map((_, node) => $(node).text())
    .get();
  expect(new Set(urls).size).toBe(urls.length);
  expect(
    urls.every(
      (url) =>
        !url.includes('#') &&
        !url.includes('/api/') &&
        !url.includes('children-education'),
    ),
  ).toBe(true);
  for (const lang of ['ru', 'en']) {
    const index = await (
      await request.get(`${base}/api/v1/knowledge/${lang}/index.json`)
    ).json();
    for (const entry of index.records.filter((r: any) =>
      ['lesson', 'mechanic', 'practice', 'lens', 'path', 'catalog'].includes(
        r.type,
      ),
    )) {
      expect(urls).toContain(entry.url);
      const node = $('url').filter(
        (_, node) => $(node).find('loc').text() === entry.url,
      );
      expect(node.find('xhtml\\:link')).toHaveLength(2);
      if (entry.updatedAt)
        expect(node.find('lastmod').text()).toBe(entry.updatedAt);
    }
  }
});
