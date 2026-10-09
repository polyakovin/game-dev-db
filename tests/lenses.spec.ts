import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { validateLenses } from '../src/lib/lenses.mjs';
const data = JSON.parse(
  readFileSync(new URL('../src/data/lenses.json', import.meta.url), 'utf8'),
);
const base = '/game-dev-db';
for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: lens discovery, combined search, editions and keyboard controls`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`${base}/${lang}/`);
    await page.locator('[data-lenses-card]').click();
    await expect(page).toHaveURL(`${base}/${lang}/lenses/`);
    await expect(page.locator('[data-lens]')).toHaveCount(117);
    await expect(page.locator('[data-lens-status]')).toContainText('117 / 117');
    await page.locator('#lens-source').selectOption('schell-third');
    await expect(page.locator('[data-lens]:visible')).toHaveCount(3);
    await page.locator('#lens-theme').selectOption('interface');
    await page.locator('#lens-search').fill('Metaphor');
    await expect(page.locator('[data-lens]:visible')).toHaveCount(1);
    await expect(page.locator('#schell-067-5')).toHaveAttribute('open', '');
    await page.locator('#lens-source').selectOption('deterding');
    await expect(page.locator('[data-lens-empty]')).toBeVisible();
    await page.locator('[data-lens-empty] [data-lens-reset]').click();
    await expect(page.locator('[data-lens]:visible')).toHaveCount(117);
    const first = data.lenses[0];
    await page.locator('#lens-search').fill(first.questions[0][lang]);
    await expect(page.locator('[data-lens]:visible')).toHaveCount(1);
    await expect(page.locator(`#${first.id}`)).toBeVisible();
    await page.locator('.lenses-controls [data-lens-reset]').click();
    await page.locator('[data-lens-expand]').click();
    await expect(page.locator('[data-lens][open]')).toHaveCount(117);
    await page.locator('[data-lens-collapse]').click();
    await expect(page.locator('[data-lens][open]')).toHaveCount(0);
    await page.locator('[data-lens] summary').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-lens][open]')).toHaveCount(1);
    const other = lang === 'ru' ? 'en' : 'ru';
    await page.locator('[data-language-switch]').click();
    await expect(page).toHaveURL(`${base}/${other}/lenses/`);
    await expect(page.locator('html')).toHaveAttribute('lang', other);
    expect(errors).toEqual([]);
  });
  test(`${lang}: lens mobile layout, source filters and fractional deep link`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${base}/${lang}/lenses/#schell-095-5`);
    await expect(
      page.locator('#schell-095-5 [data-lens-question]').first(),
    ).toBeVisible();
    await page.locator('#lens-source').selectOption('deterding');
    await expect(page.locator('[data-lens]:visible')).toHaveCount(1);
    await expect(page.locator('#deterding-skill-atoms')).toBeVisible();
    await page.locator('.lenses-controls [data-lens-reset]').click();
    await page.locator('[data-lens-expand]').click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await expect(
      page.locator(`.mobile-nav a[href="${base}/${lang}/lenses/"]`),
    ).toBeVisible();
  });
  test(`${lang}: complete lens reading without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
    });
    const page = await context.newPage();
    await page.goto(`${base}/${lang}/lenses/`);
    await expect(page.locator('.lenses-controls')).toBeHidden();
    await expect(page.locator('[data-lens-question]')).toHaveCount(234);
    await page.locator('#schell-067-5 summary').click();
    await expect(
      page.locator('#schell-067-5 [data-lens-question]').first(),
    ).toBeVisible();
    await expect(page.locator('#sources a')).toHaveCount(3);
    await context.close();
  });
}

test('lens exports retain all identities, original wording, fractional numbers and source rights', async ({
  request,
}) => {
  const manifest = await (
    await request.get(`${base}/api/v1/manifest.json`)
  ).json();
  expect(manifest.counts.lensPerspectives).toBe(117);
  expect(manifest.endpoints.lenses).toMatch(
    /\/game-dev-db\/api\/v1\/lenses.json$/,
  );
  const payload = await (
    await request.get(`${base}/api/v1/lenses.json`)
  ).json();
  expect(payload.catalogs).toHaveLength(2);
  for (const c of payload.catalogs) {
    expect(c.lenses).toHaveLength(117);
    expect(c.lenses.filter((l: any) => l.number === null)).toHaveLength(1);
    expect(
      c.lenses
        .filter((l: any) => l.sourceId === 'schell-third')
        .map((l: any) => l.number),
    ).toEqual(['67½', '93½', '95½']);
    expect(c.rights).toBeTruthy();
    expect(c.sources.map((s: any) => s.author)).toContain(
      'Sebastian Deterding',
    );
    const markdown = await request.get(new URL(c.markdownUrl).pathname);
    expect(markdown.ok()).toBe(true);
    const text = await markdown.text();
    for (const l of c.lenses) {
      expect(text).toContain(`id: ${l.id}`);
      expect(text).toContain(l.questions[0]);
    }
    expect(text).toContain(c.rights);
  }
});

test('lens content validation rejects coverage gaps, duplicate numbers, missing translations and unknown sources', () => {
  expect(validateLenses(data)).toEqual([]);
  const missing = structuredClone(data);
  missing.lenses.splice(0, 1);
  expect(validateLenses(missing).join('\n')).toContain('coverage');
  const duplicate = structuredClone(data);
  duplicate.lenses[1].number = '1';
  expect(validateLenses(duplicate).join('\n')).toContain('duplicate number');
  const translation = structuredClone(data);
  translation.lenses[0].questions[0].en = '';
  expect(validateLenses(translation).join('\n')).toContain('missing en');
  const source = structuredClone(data);
  source.lenses[0].sourceId = 'unknown';
  expect(validateLenses(source).join('\n')).toContain('unknown source');
});
