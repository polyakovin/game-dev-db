import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';

const base = '/game-dev-db';
const catalog = `${base}/ru/`;
const visibleCards = '[data-lesson-card]:visible';
const lessonCount = readdirSync(
  new URL('../src/content/lessons/ru/', import.meta.url),
).filter((file) => file.endsWith('.md')).length;

test('catalog combines text search and category filters, then resets', async ({
  page,
}) => {
  await page.goto(catalog);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator(visibleCards)).toHaveCount(lessonCount);
  await expect(page.locator('[data-visible-count]')).toHaveText(
    String(lessonCount).padStart(2, '0'),
  );
  await page.locator('[data-category="foundations"]').click();
  const foundationCount = await page.locator(visibleCards).count();
  expect(foundationCount).toBeGreaterThan(0);
  expect(foundationCount).toBeLessThan(lessonCount);
  await expect(page.locator('[data-visible-count]')).toHaveText(
    String(foundationCount).padStart(2, '0'),
  );
  expect(
    await page
      .locator(visibleCards)
      .evaluateAll((cards) =>
        cards.every(
          (card) => card.getAttribute('data-card-category') === 'foundations',
        ),
      ),
  ).toBe(true);
  await page.locator('#lesson-search').fill('game-loop');
  await expect(page.locator(visibleCards)).toHaveCount(1);
  await expect(page.locator('[data-visible-count]')).toHaveText('01');
  await expect(page.locator(visibleCards)).toHaveAttribute(
    'href',
    `${base}/ru/lessons/game-loop/`,
  );
  await page.locator('[data-category="design"]').click();
  await expect(page.locator(visibleCards)).toHaveCount(0);
  await expect(page.locator('[data-visible-count]')).toHaveText('00');
  await page.locator('#reset-search').click();
  await expect(page.locator('#lesson-search')).toHaveValue('');
  await expect(page.locator(visibleCards)).toHaveCount(lessonCount);
  await expect(page.locator('[data-visible-count]')).toHaveText(
    String(lessonCount).padStart(2, '0'),
  );
  await page.locator('#lesson-search').fill('no-matching-lesson-734');
  await expect(page.locator(visibleCards)).toHaveCount(0);
  await page.locator('#lesson-search').fill('');
  await expect(page.locator(visibleCards)).toHaveCount(lessonCount);
});

test('language switch preserves the current lesson', async ({ page }) => {
  await page.goto(`${base}/ru/lessons/game-loop/`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-language-switch]')).toHaveAttribute(
    'href',
    `${base}/en/lessons/game-loop/`,
  );
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(new RegExp(`${base}/en/lessons/game-loop/$`));
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toBeVisible();
});

test('resource and agent pages expose usable links', async ({ page }) => {
  await page.goto(`${base}/ru/resources/`);
  await expect(page.locator('h1')).toBeVisible();
  expect(
    await page.locator('main a[href^="https://"]').count(),
  ).toBeGreaterThan(0);
  await page.goto(`${base}/ru/for-agents/`);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator(`main a[href$="/llms.txt"]`).first()).toBeVisible();
  await expect(
    page.locator(`main a[href$="/api/v1/manifest.json"]`).first(),
  ).toBeVisible();
});

test('catalog, article and resources fit a narrow mobile viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of [
    catalog,
    `${base}/ru/lessons/game-loop/`,
    `${base}/ru/resources/`,
    `${base}/ru/for-agents/`,
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      route,
    ).toBe(true);
  }
});

test('catalog and articles remain readable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto(catalog);
  await expect(page.locator(visibleCards)).toHaveCount(lessonCount);
  await page.locator(`a[href="${base}/ru/lessons/game-loop/"]`).first().click();
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('main h2').count()).toBeGreaterThanOrEqual(3);
  await page.locator('[data-language-switch]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});
