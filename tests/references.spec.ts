import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const resources = JSON.parse(
  readFileSync(new URL('../src/data/resources.json', import.meta.url), 'utf8'),
) as Array<{ id: string; url: string; title: { ru: string; en: string } }>;
const base = '/game-dev-db';

for (const lang of ['ru', 'en'] as const) {
  test(`${lang} references group every resource once and preserve destination links`, async ({
    page,
  }) => {
    await page.goto(`${base}/${lang}/resources/`);
    await expect(page.locator('.reference-group')).toHaveCount(5);
    await expect(page.locator('[data-resource-id]')).toHaveCount(
      resources.length,
    );
    for (const resource of resources) {
      const card = page.locator(`[data-resource-id="${resource.id}"]`);
      await expect(card).toHaveCount(1);
      await expect(card).toHaveAttribute('href', resource.url);
      await expect(card.locator('h3')).toHaveText(resource.title[lang]);
    }
    const mario = page.locator('[data-resource-id="super-mario-maker-2"]');
    await expect(mario.locator('.resource-access')).toContainText(
      'Nintendo Switch',
    );
    await expect(mario.locator('.resource-practice')).toBeVisible();
    await expect(page.locator('[data-language-switch]')).toHaveAttribute(
      'href',
      `${base}/${lang === 'ru' ? 'en' : 'ru'}/resources/`,
    );
    await page.locator('[data-language-switch]').click();
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      lang === 'ru' ? 'en' : 'ru',
    );
  });
}

test('reference groups and practice work on a narrow screen without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  for (const lang of ['ru', 'en']) {
    await page.goto(`${base}/${lang}/resources/`);
    const practiceLink = page.locator('.reference-jumps a[href="#practice"]');
    await practiceLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#practice$/);
    await expect(page.locator('#practice h2')).toBeInViewport();
    await expect(
      page.locator('[data-resource-id="platformer-toolkit"]'),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  }
  await context.close();
});
