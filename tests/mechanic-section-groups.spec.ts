import { expect, test } from '@playwright/test';

const base = '/game-dev-db';
const labels = {
  ru: ['Действия', 'Цели', 'Награды', 'Ограничения'],
  en: ['Activities', 'Goals', 'Rewards', 'Constraints'],
};

for (const lang of ['ru', 'en'] as const) {
  const route = `${base}/${lang}/mechanics/rpg-grind/`;
  const combat = lang === 'ru' ? 'Бой и охота' : 'Combat and hunting';

  test(`${lang}: grouped contents, keyboard navigation and filters`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    await expect(page.locator('[data-toc] .toc-group-label')).toHaveText(
      labels[lang],
    );
    await expect(page.locator('[data-toc] a[href="#combat-hunts"]')).toHaveText(
      combat,
    );
    await expect(page.locator('[data-mechanic-group] > h2')).toHaveText(
      labels[lang],
    );
    await expect(page.locator('#combat-hunts > h3')).toHaveText(combat);
    expect(
      await page
        .locator('#mechanic-section optgroup')
        .evaluateAll((groups) =>
          groups.map((group) => group.getAttribute('label')),
        ),
    ).toEqual(labels[lang]);

    const gear = page.locator('[data-toc] a[href="#equipment-loot"]');
    await gear.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${route}#equipment-loot`);
    await expect(gear).toHaveAttribute('aria-current', 'location');

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('#mechanic-section').selectOption('equipment-loot');
    await expect(page.locator('[data-mechanic-group]:visible > h2')).toHaveText(
      [labels[lang][1]],
    );
    await expect(gear).toHaveAttribute('aria-current', 'location');
    await page.locator('#mechanic-search').fill('no-such-mechanic-987654321');
    await expect(page.locator('[data-mechanic-group]:visible')).toHaveCount(0);
    await expect(page.locator('[data-mechanic-empty]')).toBeVisible();
    await page.locator('[data-reset]').first().click();
    await expect(page.locator('[data-mechanic-group]:visible')).toHaveCount(4);

    for (const width of [375, 768]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  });

  test(`${lang}: static hierarchy and equivalent exports`, async ({
    browser,
    baseURL,
    request,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
    });
    const page = await context.newPage();
    await page.goto(route);
    await expect(page.locator('[data-toc] .toc-group-label')).toHaveText(
      labels[lang],
    );
    await expect(page.locator('[data-mechanic-group] > h2')).toHaveText(
      labels[lang],
    );
    await page.locator('[data-toc] a[href="#combat-hunts"]').click();
    await expect(page.locator('#combat-hunts')).toBeInViewport();
    await expect(page.locator('#combat-hunts > h3')).toHaveText(combat);
    await context.close();

    const markdown = await request.get(
      `${base}/content/mechanics/${lang}/rpg-grind.md`,
    );
    const text = await markdown.text();
    expect(text).toContain(`## ${labels[lang][0]}\n`);
    expect(text).toContain(`### ${combat}\n`);
    expect(text).toContain('<a id="combat-hunts"></a>');
    expect(text).not.toContain(`${labels[lang][0]} ·`);
    const response = await request.get(`${base}/api/v1/mechanics.json`);
    const catalog = (await response.json()).catalogs.find(
      (c: { id: string; lang: string }) =>
        c.id === 'rpg-grind' && c.lang === lang,
    );
    expect(catalog.sections[0]).toEqual({
      id: 'combat-hunts',
      title: combat,
      group: labels[lang][0],
    });
  });
}
