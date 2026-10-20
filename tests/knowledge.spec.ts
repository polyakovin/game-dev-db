import { expect, test } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';
import {
  buildKnowledge,
  knowledgeIndex,
  knowledgeMarkdown,
  sourceIdentity,
  validateKnowledge,
} from '../src/lib/knowledge.mjs';
import { searchKnowledge } from '../src/lib/knowledge-search.mjs';
import { resolveMechanicCatalog } from '../src/lib/mechanic-source.mjs';

const base = '/game-dev-db';
const lessons = (lang: string) =>
  readdirSync(`src/content/lessons/${lang}`)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(
        readFileSync(`src/content/lessons/${lang}/${file}`, 'utf8'),
      );
      return { ...data, body: content };
    });
const datasets = {
  ru: buildKnowledge(lessons('ru'), 'ru'),
  en: buildKnowledge(lessons('en'), 'en'),
};

test('uniform records preserve bilingual identities, source IDs, sections and direct/reverse connections', () => {
  const fields = [
    'key',
    'type',
    'id',
    'lang',
    'title',
    'summary',
    'updatedAt',
    'status',
    'url',
    'jsonUrl',
    'markdownUrl',
    'sources',
    'sourceIds',
    'sections',
    'relations',
    'provenance',
    'license',
    'attribution',
  ];
  for (const data of Object.values(datasets)) {
    expect(validateKnowledge(data)).toEqual([]);
    // Node assertions avoid emitting tens of thousands of runner steps as the catalog grows.
    for (const record of data.records) {
      for (const field of fields)
        assert.ok(
          Object.hasOwn(record, field),
          `${record.key}: missing ${field}`,
        );
      assert.ok(record.sections.length > 0, `${record.key}: empty sections`);
      assert.ok(
        record.jsonUrl.includes(`${base}/api/v1/knowledge/${data.lang}/`),
        record.key,
      );
      assert.ok(
        knowledgeMarkdown(record).includes(`key: ${record.key}`),
        record.key,
      );
    }
  }
  assert.deepEqual(
    datasets.ru.records.map((r: any) => r.key).sort(),
    datasets.en.records.map((r: any) => r.key).sort(),
  );
  const english = new Map(
    datasets.en.records.map((record: any) => [record.key, record]),
  );
  for (const ru of datasets.ru.records) {
    const en = english.get(ru.key)!;
    assert.deepEqual(ru.sourceIds, en.sourceIds, ru.key);
    assert.deepEqual(
      ru.sections.map((s: any) => s.id),
      en.sections.map((s: any) => s.id),
      ru.key,
    );
  }
  const mechanic = datasets.ru.records.find(
    (r: any) => r.key === 'mechanic/rpg-grind--experience-leveling',
  )!;
  assert.ok(
    mechanic.relations.some(
      (r: any) =>
        r.key === 'lesson/progression-pacing' && r.direction === 'incoming',
    ),
  );
  assert.equal(
    sourceIdentity('https://example.org/page/#section'),
    sourceIdentity('https://example.org/page'),
  );
  const shared = datasets.ru.records.find(
    (r: any) => r.key === 'mechanic/shared-family-02',
  )!;
  assert.equal(shared.placements.length, 2);
  assert.ok(shared.sections.some((s: any) => s.id === 'context-education'));
});

test('knowledge validation rejects dangling relations, duplicate sections and prerequisite cycles', () => {
  const broken = structuredClone(datasets.en);
  broken.edges.push({
    from: 'lesson/missing',
    type: 'requires',
    to: 'lesson/game-loop',
  });
  broken.edges.push({
    from: 'lesson/scope-and-prototype',
    type: 'requires',
    to: 'lesson/game-loop',
  });
  broken.records[0].sections.push(broken.records[0].sections[0]);
  const errors = validateKnowledge(broken).join();
  expect(errors).toContain('dangling relation');
  expect(errors).toContain('prerequisite cycle');
  expect(errors).toContain('duplicate section');
  expect(() =>
    resolveMechanicCatalog({
      id: 'broken',
      families: [{ ref: 'missing-family' }],
    }),
  ).toThrow('unknown mechanic reference');
});

test('search finds body text and aliases, excludes archives and respects content types', () => {
  const search = knowledgeIndex(datasets.ru, { search: true }).records;
  expect(
    searchKnowledge(search, 'СТОЛКНОВЕНИЯ', 'lesson').some(
      (r: any) => r.id === 'collision-basics',
    ),
  ).toBe(true);
  expect(
    searchKnowledge(search, 'dtSeconds', 'lesson').some(
      (r: any) => r.id === 'game-loop',
    ),
  ).toBe(true);
  expect(searchKnowledge(search, 'гринд', 'mechanic').length).toBeGreaterThan(
    0,
  );
  expect(searchKnowledge(search, 'небывалыйпоисковыйтокен').length).toBe(0);
  expect(
    search.some(
      (r: any) => r.status === 'archived' || r.id === 'children-education',
    ),
  ).toBe(false);
  expect(
    knowledgeIndex(datasets.ru).records.every(
      (r: any) => !('text' in r) && !('sections' in r),
    ),
  ).toBe(true);
  const expired = [
    { ...search[0], type: 'jam', endsAt: '2000-01-01T00:00:00Z' },
  ];
  expect(searchKnowledge(expired, '').length).toBe(0);
});

test('pathfinding table supports the documented alternative route and unreachable case', () => {
  const source = readFileSync(
    'src/content/lessons/ru/npc-pathfinding.md',
    'utf8',
  );
  const edges = [
    ...source.matchAll(/^\| ([A-Z])–([A-Z])\s*\|\s*(\d+)\s*\|/gm),
  ].map((m) => [m[1], m[2], Number(m[3])] as const);
  const shortest = (blocked: string[]) => {
    const costs: Record<string, number> = { A: 0 },
      pending = ['A'];
    while (pending.length) {
      pending.sort((a, b) => costs[a] - costs[b]);
      const node = pending.shift()!;
      if (node === 'G') return costs[node];
      for (const [a, b, cost] of edges) {
        if (blocked.includes(`${a}–${b}`)) continue;
        const next = a === node ? b : b === node ? a : null;
        if (next && (costs[next] ?? Infinity) > costs[node] + cost) {
          costs[next] = costs[node] + cost;
          pending.push(next);
        }
      }
    }
    return Infinity;
  };
  expect(shortest([])).toBe(4);
  expect(shortest(['D–G'])).toBe(5);
  expect(shortest(['D–G', 'B–G'])).toBe(Infinity);
  expect(source).toContain('стоимостью 5');
});

for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: search, type filter, query links and reset work on a narrow screen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(
      `${base}/${lang}/search/?q=${lang === 'ru' ? 'гринд' : 'grind'}&type=mechanic`,
    );
    await expect(page.locator('[data-knowledge-result]').first()).toBeVisible();
    await expect(
      page.locator('[data-knowledge-result]').first(),
    ).toHaveAttribute('href', /^\/game-dev-db\//);
    expect(
      await page.locator('[data-knowledge-result]').count(),
    ).toBeGreaterThan(0);
    await expect(page.locator('#knowledge-type')).toHaveValue('mechanic');
    await page.locator('#knowledge-query').fill('небывалыйпоисковыйтокен');
    await expect(page.locator('[data-knowledge-empty]')).toBeVisible();
    await page.locator('[data-knowledge-empty] [data-knowledge-reset]').click();
    await expect(page.locator('#knowledge-query')).toBeFocused();
    await expect(page.locator('#knowledge-type')).toHaveValue('all');
    await expect(page.locator('[data-knowledge-result]')).toHaveCount(24);
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  });

  test(`${lang}: meaningful links are bidirectional and native without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
    });
    const page = await context.newPage();
    await page.goto(`${base}/${lang}/lessons/progression-pacing/`);
    const application = page.locator(
      '[data-knowledge-target="mechanic/rpg-grind--experience-leveling"]',
    );
    await expect(application).toHaveAttribute(
      'href',
      `${base}/${lang}/mechanics/rpg-grind/#experience-leveling`,
    );
    await application.click();
    await page.locator('#experience-leveling > summary').click();
    await expect(
      page.locator(
        '#experience-leveling [data-knowledge-target="lesson/progression-pacing"]',
      ),
    ).toBeVisible();
    await page.goto(`${base}/${lang}/search/`);
    await expect(page.locator('[data-search-controls]')).toBeHidden();
    await expect(page.locator('.search-sections a')).toHaveCount(6);
    await context.close();
  });

  test(`${lang}: individual exports have the same uniform record and archive context`, async ({
    request,
  }) => {
    const index = await (
      await request.get(`${base}/api/v1/knowledge/${lang}/index.json`)
    ).json();
    const lesson = index.records.find(
      (r: any) => r.key === 'lesson/progression-pacing',
    );
    const payload = await (
      await request.get(new URL(lesson.jsonUrl).pathname)
    ).json();
    expect(payload.schemaVersion).toBe(1);
    const markdown = matter(
      await (await request.get(new URL(lesson.markdownUrl).pathname)).text(),
    );
    expect(markdown.data.key).toBe(payload.record.key);
    expect(markdown.data.sourceIds).toEqual(payload.record.sourceIds);
    for (const section of payload.record.sections)
      expect(markdown.content).toContain(section.body);
    const archive = await (
      await request.get(
        `${base}/api/v1/knowledge/${lang}/catalog/children-education.json`,
      )
    ).json();
    expect(archive.record.status).toBe('archived');
    expect(archive.record.supersededBy).toEqual([
      'catalog/children',
      'catalog/education',
    ]);
    expect(
      archive.record.relations.some((r: any) => r.type === 'supersededBy'),
    ).toBe(true);
  });
}
