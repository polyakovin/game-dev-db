import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import {
  orderEntries,
  orderMechanicCatalog,
  validateContentOrder,
} from '../src/lib/content-order.mjs';

const base = '/game-dev-db';
const ids = (items: { id: string }[]) => items.map((item) => item.id);

test('editorial order is stable, non-mutating and retains unranked additions', () => {
  const input = [
    { id: 'new-first' },
    { id: 'game-loop' },
    { id: 'new-second' },
    { id: 'scope-and-prototype' },
  ];
  const before = structuredClone(input);
  expect(ids(orderEntries(input, 'lessons'))).toEqual([
    'scope-and-prototype',
    'game-loop',
    'new-first',
    'new-second',
  ]);
  expect(input).toEqual(before);
  expect(orderEntries(input, 'unknown-scope')).toEqual(input);
  const source = JSON.parse(
    readFileSync(
      new URL('../src/data/mechanics/voice-audio.json', import.meta.url),
      'utf8',
    ),
  );
  const original = structuredClone(source);
  const ordered = orderMechanicCatalog(source);
  expect(ordered.notes[0].id).toBe('encoding');
  expect(
    ordered.families.find((f: any) => f.id === 'family-03').branches[0].id,
  ).toBe('family-03-branch-2');
  expect(ordered.families[0].branches[2].variants[0].id).toBe(
    'family-01-branch-3-variant-3',
  );
  expect(source).toEqual(original);
});

test('editorial validation rejects duplicate identities and stale scopes or entries', () => {
  expect(
    validateContentOrder({ topics: ['a', 'b'] }, { topics: ['b', 'a'] }),
  ).toEqual([]);
  expect(
    validateContentOrder({ topics: ['a'] }, { topics: ['a', 'a'] }).join(),
  ).toContain('duplicate identity');
  expect(
    validateContentOrder({ topics: ['a'] }, { topics: ['missing'] }).join(),
  ).toContain('unknown identity');
  expect(validateContentOrder({}, { missing: ['a'] }).join()).toContain(
    'unknown scope',
  );
});

for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: catalog groups and items share editorial order with their exports`, async ({
    page,
    request,
  }) => {
    // This integration check visits every catalog and its Markdown export.
    test.setTimeout(120_000);
    const lessons = (
      await (await request.get(`${base}/api/v1/lessons.json`)).json()
    ).lessons.filter((l: any) => l.lang === lang);
    await page.goto(`${base}/${lang}/`);
    const lessonIds = () =>
      page
        .locator('[data-lesson-card]')
        .evaluateAll((cards) =>
          cards.map((card) => card.getAttribute('href')!.split('/').at(-2)),
        );
    await expect.poll(lessonIds).toEqual(ids(lessons));
    expect(lessons.slice(0, 3).map((l: any) => l.id)).toEqual([
      'scope-and-prototype',
      'game-loop',
      'input-and-feedback',
    ]);
    await page.locator('#lesson-search').fill('nonexistent-priority-check');
    await page.locator('#reset-search').click();
    await expect.poll(lessonIds).toEqual(ids(lessons));

    const mechanics = (
      await (await request.get(`${base}/api/v1/mechanics.json`)).json()
    ).catalogs.filter((c: any) => c.lang === lang);
    expect(mechanics[0].id).toBe('game-mechanics');
    expect(
      await page
        .locator('[data-mechanics-card]')
        .evaluateAll((cards) =>
          cards.map((c) => c.getAttribute('href')!.split('/').at(-2)),
        ),
    ).toEqual(
      ids(
        mechanics.filter((catalog: any) => catalog.id !== 'children-education'),
      ),
    );
    const directionIndex = (
      await (
        await request.get(`${base}/api/v1/mechanic-directions.json`)
      ).json()
    ).indexes.find((index: any) => index.lang === lang);
    await page.goto(`${base}/${lang}/mechanics/`);
    expect(
      await page
        .locator('[data-mechanics-card]')
        .evaluateAll((cards) =>
          cards.map((c) => c.getAttribute('href')!.split('/').at(-2)),
        ),
    ).toEqual(
      [
        ...directionIndex.additionalCatalogs,
        ...directionIndex.groups.flatMap((group: any) => group.directions),
      ]
        .filter((entry: any) => entry.status === 'ready')
        .map((entry: any) => entry.materialRef?.catalogId ?? entry.catalogId),
    );
    for (const catalog of mechanics) {
      await page.goto(new URL(catalog.url).pathname);
      expect(
        await page
          .locator('[data-mechanic-section]')
          .evaluateAll((nodes) => nodes.map((n) => n.id)),
      ).toEqual(ids(catalog.sections));
      expect(
        await page
          .locator('#mechanic-section option:not([value="all"])')
          .evaluateAll((options) =>
            options.map((o) => (o as HTMLOptionElement).value),
          ),
      ).toEqual(ids(catalog.sections));
      expect(
        await page
          .locator('[data-family]')
          .evaluateAll((nodes) => nodes.map((n) => n.id)),
      ).toEqual(ids(catalog.families));
      expect(
        await page
          .locator('[data-branch-title]')
          .evaluateAll((nodes) => nodes.map((n) => n.id)),
      ).toEqual(catalog.families.flatMap((f: any) => ids(f.branches)));
      expect(
        await page
          .locator('[data-variant]')
          .evaluateAll((nodes) => nodes.map((n) => n.id)),
      ).toEqual(
        catalog.families.flatMap((f: any) =>
          f.branches.flatMap((b: any) => ids(b.variants)),
        ),
      );
      const markdown = await (
        await request.get(new URL(catalog.markdownUrl).pathname)
      ).text();
      const headings = catalog.families.map((f: any, i: number) =>
        markdown.indexOf(`### ${i + 1}. ${f.title}\n`),
      );
      expect(
        headings.every(
          (position: number, i: number) =>
            position >= 0 && (i === 0 || position > headings[i - 1]),
        ),
      ).toBe(true);
    }
    const boss = mechanics.find((c: any) => c.id === 'boss-fight-atlas');
    expect(ids(boss.families).slice(0, 4)).toEqual([
      'boss-telegraph',
      'boss-wind-up',
      'boss-active-phase',
      'boss-recovery',
    ]);

    const lenses = (
      await (await request.get(`${base}/api/v1/lenses.json`)).json()
    ).catalogs.find((c: any) => c.lang === lang);
    await page.goto(`${base}/${lang}/lenses/`);
    expect(
      await page
        .locator('[data-lens-theme-group]')
        .evaluateAll((nodes) => nodes.map((n) => n.id)),
    ).toEqual(ids(lenses.themes));
    expect(
      await page
        .locator('[data-lens]')
        .evaluateAll((nodes) => nodes.map((n) => n.id)),
    ).toEqual(ids(lenses.lenses));
    expect(lenses.lenses[0].id).toBe('schell-002');
    expect(lenses.lenses[0].number).toBe('2');

    const practice = (
      await (await request.get(`${base}/api/v1/practice.json`)).json()
    ).catalogs.find((c: any) => c.lang === lang);
    await page.goto(`${base}/${lang}/practice/`);
    expect(
      await page
        .locator('[data-exercise]')
        .evaluateAll((nodes) => nodes.map((n) => n.id)),
    ).toEqual(ids(practice.tasks));
    expect(practice.tasks[0].id).toBe('paper-current');
    const paper = page.locator('#paper-current');
    await paper.locator('summary').click();
    expect(
      await paper.locator('[data-exercise-steps] li').allTextContents(),
    ).toEqual(practice.tasks[0].steps);

    const resources = (
      await (await request.get(`${base}/api/v1/resources.json`)).json()
    ).resources;
    await page.goto(`${base}/${lang}/resources/`);
    expect(
      await page
        .locator('.reference-group')
        .evaluateAll((nodes) => nodes.map((n) => n.id)),
    ).toEqual(['books', 'practice', 'research', 'development', 'channels']);
    expect(
      await page
        .locator('[data-resource-id]')
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getAttribute('data-resource-id')),
        ),
    ).toEqual(ids(resources));
  });

  test(`${lang}: importance order survives narrow static reading`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    for (const [route, selector, expected] of [
      ['mechanics/boss-fight-atlas/', '[data-family]', 'boss-telegraph'],
      ['lenses/', '[data-lens]', 'schell-002'],
      ['practice/', '[data-exercise]', 'paper-current'],
    ]) {
      await page.goto(`${base}/${lang}/${route}`);
      const first = page.locator(selector).first();
      await expect(first).toHaveAttribute('id', expected);
      if ((await first.getAttribute('open')) !== null)
        await first.locator('summary').click();
      await first.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(first).toHaveAttribute('open', '');
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
    await context.close();
  });
}
