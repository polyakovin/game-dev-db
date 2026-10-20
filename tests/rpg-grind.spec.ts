import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const source = JSON.parse(
  readFileSync(
    new URL('../src/data/mechanics/rpg-grind.json', import.meta.url),
    'utf8',
  ),
);
const legacy =
  `experience-leveling skill-use weapon-proficiency profession-leveling breadth-mastery target-boss-farming rarity-hunting perfect-rolls equipment-sets fragment-collection enhancement-levels property-rerolls gem-rune-upgrades item-evolution duplicate-fusion gathering-routes monster-ingredients loot-salvaging production-chains consumable-supply faction-reputation token-currency access-keys settlement-development recipe-research scaling-dungeons endless-waves repeatable-contracts collectibles prestige-rebirth`.split(
    ' ',
  );
const base = '/game-dev-db';

test('RPG coverage includes four layers, major missing systems and every original identity', () => {
  expect(source.families.length).toBeGreaterThanOrEqual(110);
  expect(
    source.families.flatMap((f: any) =>
      f.branches.flatMap((b: any) => b.variants),
    ).length,
  ).toBeGreaterThanOrEqual(330);
  for (const id of legacy) {
    const family = source.families.find((f: any) => f.id === id);
    expect(family, id).toBeTruthy();
    expect(family.branches.map((b: any) => b.id)).toContain(`${id}-loop`);
    expect(
      family.branches.flatMap((b: any) => b.variants.map((v: any) => v.id)),
    ).toContain(`${id}-repeat`);
  }
  for (const id of [
    'character-progression',
    'equipment-loot',
    'equipment-upgrades',
    'resources-production',
    'reputation-access',
    'challenges-collections',
  ])
    expect(source.sections.map((s: any) => s.id)).toContain(id);
  for (const id of [
    'market-arbitrage',
    'archaeology-surveys',
    'companion-rapport',
    'offline-accumulation',
    'guild-projects',
    'hard-pity',
    'duplicate-protection',
    'catch-up',
    'banking-extraction',
  ])
    expect(source.families.map((f: any) => f.id)).toContain(id);
  expect(new Set(source.sections.map((s: any) => s.group.en))).toEqual(
    new Set(['Activities', 'Goals', 'Rewards', 'Constraints']),
  );
  for (const family of source.families) {
    expect(family.description.ru.length).toBeGreaterThan(20);
    expect(family.description.en.length).toBeGreaterThan(20);
    expect(family.example.ru.length).toBeGreaterThan(20);
    expect(family.example.en.length).toBeGreaterThan(20);
    expect(family.branches.flatMap((b: any) => b.variants)).toHaveLength(3);
  }
});

for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: RPG search reaches all layers and published fragments survive`, async ({
    page,
  }) => {
    const route = `${base}/${lang}/mechanics/rpg-grind/`;
    await page.goto(route);
    for (const id of [
      'worker-assignment',
      'companion-rapport',
      'hard-pity',
      'catch-up',
    ]) {
      const family = source.families.find((f: any) => f.id === id);
      await page.locator('#mechanic-section').selectOption(family.section);
      await page.locator('#mechanic-search').fill(family.title[lang]);
      await expect(page.locator('[data-family]:visible')).toHaveCount(1);
      await expect(page.locator(`#${id}`)).toHaveAttribute('open', '');
      await expect(page.locator(`#${id} [data-variant]:visible`)).toHaveCount(
        3,
      );
      await page.locator('[data-reset]').first().click();
    }
    await page.goto(`${route}#experience-leveling-repeat`);
    await expect(page.locator('#experience-leveling-repeat')).toBeVisible();
    await page.goto(`${route}#hard-pity-option-1`);
    await expect(page.locator('#hard-pity-option-1')).toBeVisible();
    await page.locator('[data-language-switch]').click();
    const other = lang === 'ru' ? 'en' : 'ru';
    await expect(page).toHaveURL(`${base}/${other}/mechanics/rpg-grind/`);
  });

  test(`${lang}: expanded RPG reference fits mobile and remains readable without scripts`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
      colorScheme: 'dark',
    });
    const page = await context.newPage();
    await page.goto(`${base}/${lang}/mechanics/rpg-grind/`);
    await expect(page.locator('[data-family]')).toHaveCount(
      source.families.length,
    );
    await expect(page.locator('[data-variant]')).toHaveCount(330);
    await expect(page.locator('#coverage-map')).toBeVisible();
    await page.locator('#worker-assignment summary').click();
    await expect(
      page.locator('#worker-assignment [data-variant]').first(),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await context.close();
  });
}

test('RPG exports retain the expanded reference, notes, source context and old IDs', async ({
  request,
}) => {
  const response = await request.get(`${base}/api/v1/mechanics.json`);
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(payload.schemaVersion).toBe(1);
  for (const lang of ['ru', 'en']) {
    const catalog = payload.catalogs.find(
      (c: any) => c.id === 'rpg-grind' && c.lang === lang,
    );
    expect(catalog.counts.families).toBe(source.families.length);
    expect(catalog.counts.variants).toBe(330);
    expect(catalog.sections).toHaveLength(18);
    expect(catalog.notes.map((n: any) => n.id)).toEqual(
      expect.arrayContaining([
        'coverage-map',
        'loop-recipes',
        'classification-boundaries',
        'system-audit',
      ]),
    );
    expect(catalog.sources.length).toBeGreaterThanOrEqual(8);
    for (const id of legacy)
      expect(catalog.families.map((f: any) => f.id)).toContain(id);
    const markdown = await request.get(
      `${base}/content/mechanics/${lang}/rpg-grind.md`,
    );
    expect(markdown.ok()).toBe(true);
    const text = await markdown.text();
    for (const title of catalog.sections.map((s: any) => s.title))
      expect(text).toContain(title);
    expect(text).toContain('CC-BY-4.0');
    expect(text).toContain('hypothetical');
  }
});
