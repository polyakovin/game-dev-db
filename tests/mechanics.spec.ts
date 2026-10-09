import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const base = '/game-dev-db';
const catalogs = ['voice-audio', 'point-and-click', 'children-education'].map(
  (id) =>
    JSON.parse(
      readFileSync(
        new URL(`../src/data/mechanics/${id}.json`, import.meta.url),
        'utf8',
      ),
    ),
);

for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: mechanics discovery from home and index`, async ({ page }) => {
    await page.goto(`${base}/${lang}/`);
    await expect(page.locator('[data-mechanics-card]')).toHaveCount(3);
    await page.locator(`.sidebar a[href="${base}/${lang}/mechanics/"]`).click();
    await expect(page.locator('[data-mechanics-card]')).toHaveCount(3);
    for (const c of catalogs)
      await expect(
        page.locator(
          `[data-mechanics-card][href="${base}/${lang}/mechanics/${c.id}/"]`,
        ),
      ).toBeVisible();
  });
  for (const c of catalogs) {
    const route = `${base}/${lang}/mechanics/${c.id}/`;
    const total = c.families.flatMap((f: any) =>
      f.branches.flatMap((b: any) => b.variants),
    ).length;
    test(`${lang}/${c.id}: filter variant text, reset and use disclosures`, async ({
      page,
    }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      await page.goto(route);
      await expect(page.locator('[data-family]')).toHaveCount(
        c.families.length,
      );
      await expect(page.locator('[data-variant]')).toHaveCount(total);
      await expect(page.locator('[data-mechanic-status]')).toContainText(
        `${total} / ${total}`,
      );
      const first = c.families[0];
      await page.locator('#mechanic-section').selectOption(first.section);
      await page
        .locator('#mechanic-search')
        .fill(first.branches[0].variants[0].text[lang]);
      await expect(page.locator('[data-family]:visible')).toHaveCount(1);
      await expect(page.locator('[data-variant]:visible')).toHaveCount(1);
      await expect(page.locator(`#${first.id}`)).toHaveAttribute('open', '');
      await page
        .locator('#mechanic-section')
        .selectOption(c.sections.at(-1).id);
      await expect(page.locator('[data-mechanic-empty]')).toBeVisible();
      await page.locator('[data-mechanic-empty] [data-reset]').click();
      await expect(page.locator('#mechanic-search')).toHaveValue('');
      await expect(page.locator('#mechanic-section')).toHaveValue('all');
      await expect(page.locator('[data-family]:visible')).toHaveCount(
        c.families.length,
      );
      await page.locator('[data-expand]').click();
      await expect(page.locator('[data-family][open]')).toHaveCount(
        c.families.length,
      );
      await page.locator('[data-collapse]').click();
      await expect(page.locator('[data-family][open]')).toHaveCount(0);
      const summary = page.locator('[data-family] summary').first();
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator(`[data-family][open]`)).toHaveCount(1);
      const other = lang === 'ru' ? 'en' : 'ru';
      await page.locator('[data-language-switch]').click();
      await expect(page).toHaveURL(`${base}/${other}/mechanics/${c.id}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', other);
      expect(pageErrors).toEqual([]);
    });
    test(`${lang}/${c.id}: mobile layout and variant deep links`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`${base}/${lang}/mechanics/`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const last = c.families.at(-1);
      const variant = last.branches.at(-1).variants.at(-1);
      await page.goto(`${route}#${variant.id}`);
      await expect(page.locator(`#${variant.id}`)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await page.locator('[data-expand]').click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    });
    test(`${lang}/${c.id}: complete reading without JavaScript`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        baseURL,
      });
      const page = await context.newPage();
      await page.goto(route);
      await expect(page.locator('.mechanics-controls')).toBeHidden();
      await expect(page.locator('[data-variant]')).toHaveCount(total);
      await page.locator('[data-family] summary').first().click();
      await expect(page.locator('[data-variant]').first()).toBeVisible();
      await expect(page.locator('#sources a')).toHaveCount(c.sources.length);
      await context.close();
    });
  }
}

test('mechanic exports preserve full tree, Markdown and manifest discovery', async ({
  request,
}) => {
  const manifest = await (
    await request.get(`${base}/api/v1/manifest.json`)
  ).json();
  expect(manifest.endpoints.mechanics).toMatch(
    /\/game-dev-db\/api\/v1\/mechanics.json$/,
  );
  const data = await (
    await request.get(`${base}/api/v1/mechanics.json`)
  ).json();
  expect(data.catalogs).toHaveLength(6);
  for (const c of data.catalogs) {
    const markdown = await request.get(new URL(c.markdownUrl).pathname);
    expect(markdown.ok()).toBe(true);
    expect(await markdown.text()).toContain(
      c.families.at(-1).branches.at(-1).variants.at(-1).text,
    );
    expect(c.body).toContain(c.sources[0].url);
  }
});
