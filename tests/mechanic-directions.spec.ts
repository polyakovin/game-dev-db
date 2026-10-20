import { expect, test } from '@playwright/test';
import {
  getMechanicDirections,
  mechanicDirectionData,
  validateMechanicDirections,
  validateDirectionMaterials,
} from '../src/lib/mechanic-directions.mjs';
import { getMechanics } from '../src/lib/mechanics.mjs';

const base = '/game-dev-db';

test('the complete direction map has bilingual stable identities and validated catalog associations', () => {
  expect(validateMechanicDirections(mechanicDirectionData)).toEqual([]);
  const ru = getMechanicDirections('ru');
  const en = getMechanicDirections('en');
  expect(ru.counts.groups).toBe(32);
  expect(ru.counts.directions).toBe(329);
  expect(en.counts).toEqual(ru.counts);
  const identities = (index: ReturnType<typeof getMechanicDirections>) =>
    index.groups.map((group) => [
      group.id,
      group.directions.map((d) => [d.id, d.catalogId, d.status]),
    ]);
  expect(identities(ru)).toEqual(identities(en));
  expect(
    ru.groups
      .flatMap((group) => group.directions)
      .filter((d) => d.status === 'in-development')
      .every((d) => d.url === null && d.counts === null),
  ).toBe(true);
  for (const change of ['translation', 'identity', 'catalog'] as const) {
    const invalid = structuredClone(mechanicDirectionData);
    const first = invalid.groups[0].directions[0];
    if (change === 'translation') first.title.en = '';
    if (change === 'identity') first.id = invalid.groups[0].directions[1].id;
    if (change === 'catalog') first.catalogId = '../missing/';
    expect(validateMechanicDirections(invalid).length).toBeGreaterThan(0);
  }
});

test('readiness follows available catalog content and never treats archives as ready', () => {
  const source = mechanicDirectionData.groups[0].directions[0];
  const reference = 'materialRef' in source ? source.materialRef : undefined;
  const existing = getMechanics('ru').filter(
    (catalog) =>
      catalog.id !== source.catalogId && catalog.id !== reference?.catalogId,
  );
  const added = {
    ...existing[0],
    id: source.catalogId,
    url: `https://polyakovin.github.io${base}/ru/mechanics/${source.catalogId}/`,
  };
  const lookup = (catalogs: Parameters<typeof getMechanicDirections>[1]) =>
    getMechanicDirections('ru', catalogs).groups[0].directions[0];
  expect(lookup(existing)).toMatchObject({
    status: 'in-development',
    url: null,
  });
  expect(lookup([...existing, added])).toMatchObject({
    status: 'ready',
    url: added.url,
  });
  expect(lookup([...existing, { ...added, status: 'archived' }])).toMatchObject(
    { status: 'in-development', url: null },
  );
  expect(lookup([...existing, { ...added, status: 'draft' }])).toMatchObject({
    status: 'in-development',
    url: null,
  });
});

test('a direction resolves to a real family and prefers a standalone catalog', () => {
  const source = mechanicDirectionData.groups[0].directions[0];
  if (!('materialRef' in source)) throw new Error('Missing overview fixture');
  const reference = source.materialRef;
  if (!reference) throw new Error('Missing overview target');
  const catalogs = getMechanics('ru');
  const lookup = (items: typeof catalogs) =>
    getMechanicDirections('ru', items).groups[0].directions[0];
  const familyTarget = lookup(catalogs);
  expect(familyTarget.url).toContain(`#${reference.familyId}`);
  expect(familyTarget.counts?.families).toBe(1);
  const missing = catalogs.map((catalog) =>
    catalog.id === reference.catalogId
      ? {
          ...catalog,
          families: catalog.families.filter(
            (family) => family.id !== reference.familyId,
          ),
        }
      : catalog,
  );
  expect(lookup(missing)).toMatchObject({
    status: 'in-development',
    url: null,
  });
  expect(validateDirectionMaterials(missing).join()).toContain(source.id);
  for (const status of ['archived', 'draft']) {
    const unavailable = catalogs.map((catalog) =>
      catalog.id === reference.catalogId ? { ...catalog, status } : catalog,
    );
    expect(lookup(unavailable)).toMatchObject({
      status: 'in-development',
      url: null,
    });
    expect(validateDirectionMaterials(unavailable).join()).toContain(source.id);
  }
  const standalone = {
    ...catalogs[0],
    id: source.catalogId,
    url:
      'https://polyakovin.github.io/game-dev-db/ru/mechanics/' +
      source.catalogId +
      '/',
  };
  expect(lookup([...catalogs, standalone]).url).toBe(standalone.url);
});

for (const lang of ['ru', 'en'] as const) {
  const index = getMechanicDirections(lang);
  const route = `${base}/${lang}/mechanics/`;
  const directions = index.groups.flatMap((group) => group.directions);
  const readyGroup = index.groups.find((group) =>
    group.directions.some((d) => d.status === 'ready'),
  )!;
  const readyDirection = readyGroup.directions.find(
    (d) => d.status === 'ready',
  )!;

  test(`${lang}: complete structure, development labels and ready links`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator('[data-direction]')).toHaveCount(
      index.counts.entries,
    );
    await expect(
      page.locator('[data-direction]:not([data-group="general"])'),
    ).toHaveCount(329);
    await expect(
      page.locator('[data-direction][data-status="in-development"]'),
    ).toHaveCount(index.counts.inDevelopment);
    await expect(page.locator('[data-mechanics-card]')).toHaveCount(
      index.counts.readyMaterials,
    );
    const rendered = await page
      .locator('[data-direction]:not([data-group="general"])')
      .evaluateAll((cards) =>
        cards.map((card) => ({
          id: card.id,
          title: card.querySelector('h3')!.textContent!.trim(),
          status: card.getAttribute('data-status'),
          links: [...card.querySelectorAll('a')].map((a) =>
            a.getAttribute('href'),
          ),
          label: card.querySelector('.direction-status')!.textContent!.trim(),
        })),
      );
    expect(rendered).toEqual(
      directions.map((direction) => ({
        id: direction.id,
        title: direction.title,
        status: direction.status,
        links: direction.url
          ? [new URL(direction.url).pathname + new URL(direction.url).hash]
          : [],
        label:
          direction.status === 'ready'
            ? lang === 'ru'
              ? 'Готово'
              : 'Ready'
            : lang === 'ru'
              ? 'В разработке'
              : 'In development',
      })),
    );
    const response = await request.get(
      `${base}/api/v1/mechanic-directions.json`,
    );
    expect(response.ok()).toBe(true);
    const exported = (await response.json()).indexes.find(
      (record: any) => record.lang === lang,
    );
    expect(exported).toEqual(index);
    expect(errors).toEqual([]);
  });

  test(`${lang}: search, groups, ready-only, empty state, reset and URL state combine`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.locator('#direction-ready').check();
    await expect(page.locator('[data-direction]:visible')).toHaveCount(
      index.counts.readyMaterials,
    );
    await expect(
      page.locator('[data-direction][data-status="in-development"]:visible'),
    ).toHaveCount(0);
    await page.locator('#direction-group').selectOption(readyGroup.id);
    await page.locator('#direction-search').fill(readyDirection.title);
    await expect(page.locator('[data-direction]:visible')).toHaveCount(1);
    await expect(page.locator(`#${readyDirection.id}`)).toBeVisible();
    await expect(page.locator('[data-direction-result]')).toContainText(
      `1 / ${index.counts.entries}`,
    );
    await expect(page).toHaveURL(/ready=1/);
    await page.reload();
    await expect(page.locator('#direction-ready')).toBeChecked();
    await expect(page.locator('#direction-group')).toHaveValue(readyGroup.id);
    await expect(page.locator('#direction-search')).toHaveValue(
      readyDirection.title,
    );
    const other = lang === 'ru' ? 'en' : 'ru';
    await page.locator('[data-language-switch]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', other);
    await expect(page.locator(`#${readyDirection.id}`)).toBeVisible();
    await expect(page.locator('[data-direction]:visible')).toHaveCount(1);
    await page
      .locator('#direction-search')
      .fill('zz-no-matching-direction-999');
    await expect(page.locator('[data-direction-empty]')).toBeVisible();
    await expect(page.locator('[data-direction-group]:visible')).toHaveCount(0);
    await page.locator('[data-direction-reset]').click();
    await expect(page.locator('#direction-ready')).not.toBeChecked();
    await expect(page.locator('#direction-group')).toHaveValue('all');
    await expect(page.locator('#direction-search')).toHaveValue('');
    await expect(page.locator('[data-direction]:visible')).toHaveCount(
      index.counts.entries,
    );
    expect(new URL(page.url()).search).toBe('');
    await page.locator('#direction-search').fill(directions[0].title);
    await expect(page.locator(`#${directions[0].id}`)).toBeVisible();
    await page.locator('#direction-ready').check();
    await expect(page.locator(`#${directions[0].id}`)).toBeVisible();
    await page.locator('[data-direction-controls] [type="reset"]').click();
    await expect(page.locator('[data-direction]:visible')).toHaveCount(
      index.counts.entries,
    );
  });

  test(`${lang}: keyboard filters and narrow layouts in both themes`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.locator('#direction-ready').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#direction-ready')).toBeChecked();
    await expect(page.locator('[data-direction]:visible')).toHaveCount(
      index.counts.readyMaterials,
    );
    await page.keyboard.press('Space');
    await expect(page.locator('#direction-ready')).not.toBeChecked();
    for (const theme of ['light', 'dark']) {
      await page.locator(`[data-theme-choice="${theme}"]`).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      for (const width of [375, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
      }
    }
  });

  test(`${lang}: all directions remain readable without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    await page.goto(`${route}?ready=1`);
    await expect(page.locator('[data-direction-controls]')).toBeHidden();
    await expect(page.locator('[data-direction]:visible')).toHaveCount(
      index.counts.entries,
    );
    await expect(
      page.locator('[data-direction][data-status="in-development"]:visible'),
    ).toHaveCount(index.counts.inDevelopment);
    await page.locator(`#${readyDirection.id} a`).click();
    await expect(page).toHaveURL(
      new URL(readyDirection.url!).pathname + new URL(readyDirection.url!).hash,
    );
    await context.close();
  });
}
