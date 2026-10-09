import { expect, test } from '@playwright/test';
import {
  getPractice,
  practiceSource,
  validatePractice,
} from '../src/lib/practice.mjs';

const base = '/game-dev-db';

test('practice validation rejects missing translations, mismatched lists and invalid identities', () => {
  expect(validatePractice()).toEqual([]);
  const missing = structuredClone(practiceSource);
  missing.tasks[0].content.en.reflection = '';
  expect(
    validatePractice(missing).some((error) => error.includes('en/reflection')),
  ).toBe(true);
  const uneven = structuredClone(practiceSource);
  uneven.tasks[0].content.en.checks.pop();
  expect(
    validatePractice(uneven).some((error) =>
      error.includes('translation list lengths differ'),
    ),
  ).toBe(true);
  const invalid = structuredClone(practiceSource);
  invalid.tasks[1].id = invalid.tasks[0].id;
  invalid.tasks[0].topic = 'unknown-topic';
  invalid.tasks[0].minutes = 0;
  expect(
    validatePractice(invalid).some((error) =>
      error.includes('duplicate exercise id'),
    ),
  ).toBe(true);
  expect(
    validatePractice(invalid).some((error) => error.includes('unknown topic')),
  ).toBe(true);
  expect(
    validatePractice(invalid).some((error) => error.includes('minutes')),
  ).toBe(true);
});

for (const lang of ['ru', 'en'] as const) {
  const catalog = getPractice(lang);
  test(`${lang} practice is discoverable and combines full-content search, topic and duration`, async ({
    page,
  }) => {
    await page.goto(`${base}/${lang}/`);
    await page.locator(`main a[href="${base}/${lang}/practice/"]`).click();
    await expect(page.locator('[data-exercise]:visible')).toHaveCount(12);
    await expect(
      page.locator('.sidebar a[aria-current="page"]'),
    ).toHaveAttribute('href', `${base}/${lang}/practice/`);
    await page.locator('#practice-topic').selectOption('chance');
    await expect(page.locator('[data-exercise]:visible')).toHaveCount(2);
    await page.locator('#practice-duration').selectOption('60');
    await expect(page.locator('[data-exercise]:visible')).toHaveCount(1);
    await page
      .locator('#practice-search')
      .fill(lang === 'ru' ? 'последних ресурсов' : 'last resources');
    await expect(page.locator('[data-exercise]:visible')).toHaveAttribute(
      'id',
      'weather-window',
    );
    await expect(page.locator('[data-practice-count]')).toHaveText('01');
    await page.locator('#practice-search').fill('nonexistent-exercise-785');
    await expect(page.locator('[data-exercise]:visible')).toHaveCount(0);
    await expect(page.locator('[data-practice-empty]')).toBeVisible();
    await page.locator('[data-practice-empty] [data-practice-reset]').click();
    await expect(page.locator('#practice-search')).toHaveValue('');
    await expect(page.locator('#practice-topic')).toHaveValue('');
    await expect(page.locator('#practice-duration')).toHaveValue('');
    await expect(page.locator('[data-exercise]:visible')).toHaveCount(12);
    await expect(page.locator('[data-practice-count]')).toHaveText('12');
    await expect(page.locator('#practice-search')).toBeFocused();
    await expect(page.locator('.practice-sources')).toContainText(
      catalog.provenance,
    );
  });

  test(`${lang} practice supports keyboard disclosures, shared anchors and narrow layouts`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${base}/${lang}/practice/`);
    const exercise = page.locator('#two-windows');
    await exercise.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(exercise).toHaveAttribute('open', '');
    await expect(exercise.locator('[data-exercise-deliverable]')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await exercise.locator('.practice-permalink').click();
    const other = lang === 'ru' ? 'en' : 'ru';
    await expect(page.locator('[data-language-switch]')).toHaveAttribute(
      'href',
      `${base}/${other}/practice/#two-windows`,
    );
    await page.locator('[data-language-switch]').click();
    await expect(page).toHaveURL(
      new RegExp(`/${other}/practice/#two-windows$`),
    );
    await expect(page.locator('#two-windows')).toHaveAttribute('open', '');
    await expect(page.locator('#two-windows [data-exercise-title]')).toHaveText(
      getPractice(other).tasks.at(-1)!.title,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  });
}

test('both practice languages remain complete and operable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  for (const lang of ['ru', 'en'] as const) {
    await page.goto(`${base}/${lang}/practice/`);
    await expect(page.locator('[data-exercise]')).toHaveCount(12);
    await expect(page.locator('.practice-controls')).toBeHidden();
    await page.locator('#two-windows summary').click();
    await expect(
      page.locator('#two-windows [data-exercise-checks]'),
    ).toBeVisible();
    await expect(
      page.locator('#two-windows [data-exercise-reflection]'),
    ).toHaveText(getPractice(lang).tasks.at(-1)!.reflection);
    await expect(
      page.locator(
        '.practice-sources a[href="https://designgames.wordpress.com/toc/"]',
      ),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  await context.close();
});

test('practice exports and discovery retain complete content, provenance and canonical exercise links', async ({
  request,
}) => {
  const manifest = await (
    await request.get(`${base}/api/v1/manifest.json`)
  ).json();
  expect(manifest.counts.practiceTasks).toBe(12);
  expect(manifest.endpoints.practice).toBe(
    'https://polyakovin.github.io/game-dev-db/api/v1/practice.json',
  );
  const response = await request.get(`${base}/api/v1/practice.json`);
  expect(response.ok()).toBe(true);
  const data = await response.json();
  expect(data.license).toBe('CC-BY-4.0');
  expect(data.catalogs).toHaveLength(2);
  const discovery = await (await request.get(`${base}/llms.txt`)).text();
  for (const catalog of data.catalogs) {
    expect(catalog.tasks).toHaveLength(12);
    expect(catalog.provenance).toContain('Ian Schreiber');
    expect(discovery).toContain(catalog.markdownUrl);
    const markdown = await (
      await request.get(new URL(catalog.markdownUrl).pathname)
    ).text();
    for (const task of catalog.tasks) {
      expect(markdown).toContain(task.brief);
      expect(markdown).toContain(task.reflection);
      expect(markdown).toContain(task.url);
      expect(task.url).toMatch(
        new RegExp(`/${catalog.lang}/practice/#${task.id}$`),
      );
    }
  }
});
