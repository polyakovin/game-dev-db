import { expect, test } from '@playwright/test';

const base = '/game-dev-db';
const production = Boolean(process.env.CI || process.env.PLAYWRIGHT_PREVIEW);
const beaconUrl = 'https://static.cloudflareinsights.com/beacon.min.js';

for (const route of [
  'ru/',
  'en/',
  'ru/lessons/game-loop/',
  'en/lessons/game-loop/',
  '404.html',
]) {
  test(`${route}: reading works with analytics blocked`, async ({ page }) => {
    const requests: string[] = [];
    await page.route('https://static.cloudflareinsights.com/**', (request) => {
      requests.push(request.request().url());
      return request.abort();
    });
    await page.route('https://cloudflareinsights.com/**', (request) =>
      request.abort(),
    );

    await page.goto(`${base}/${route}`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('script[data-cf-beacon]')).toHaveCount(
      production ? 1 : 0,
    );
    expect(requests).toEqual(production ? [beaconUrl] : []);

    // Language navigation must still work after the analytics request fails.
    if (route.includes('/lessons/')) {
      await page.locator('[data-language-switch]').click();
      await expect(page).toHaveURL(
        `${base}/${route.startsWith('ru/') ? 'en' : 'ru'}/lessons/game-loop/`,
      );
      await expect(page.locator('h1')).toBeVisible();
    }
  });
}

test('root redirect omits the beacon before opening the language homepage', async ({
  request,
}) => {
  const response = await request.get(`${base}/`);
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).not.toContain('data-cf-beacon');
  expect(html).toContain(`0;url=${base}/ru/`);
});
