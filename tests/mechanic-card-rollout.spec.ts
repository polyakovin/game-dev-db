import { expect, test } from '@playwright/test';
import { buildKnowledge } from '../src/lib/knowledge.mjs';
import {
  getMechanicPreview,
  mechanicPreviews,
} from '../src/lib/mechanic-previews.mjs';
import {
  getMechanicCardQueue,
  mechanicCardOrder,
  validateMechanicCardOrder,
} from '../src/lib/mechanic-card-order.mjs';
import { validateMechanicPreviews } from '../src/lib/mechanic-preview-validation.mjs';

const records = buildKnowledge([], 'ru', []).records;
const ids = Object.keys(mechanicPreviews);
const route = (lang: string, id: string) =>
  `/game-dev-db/${lang}/knowledge/mechanic/${id}/`;

test('production order covers every active canonical mechanic exactly once', () => {
  expect(validateMechanicCardOrder(records)).toEqual([]);
  const queue = getMechanicCardQueue(records);
  expect(queue).toHaveLength(
    records.filter((r) => r.type === 'mechanic' && r.status === 'active')
      .length,
  );
  expect(queue.filter((entry) => entry.illustrated)).toHaveLength(ids.length);
  const broken = structuredClone(mechanicCardOrder);
  broken.order.push(broken.order[0]);
  broken.order.splice(1, 1);
  expect(validateMechanicCardOrder(records, broken).join('\n')).toMatch(
    /duplicate/,
  );
  expect(validateMechanicCardOrder(records, broken).join('\n')).toMatch(
    /missing/,
  );
});

test('cards reject missing translations, false image sizes and out-of-frame markers', () => {
  expect(validateMechanicPreviews(records)).toEqual([]);
  const id = 'shared-family-02';
  const entry = structuredClone(mechanicPreviews[id]);
  const original = entry.image;
  const atOrigin = structuredClone(entry);
  atOrigin.image.markers[0].x = (original.crop.x / original.width) * 100;
  atOrigin.image.markers[0].y = (original.crop.y / original.height) * 100;
  expect(validateMechanicPreviews(records, { [id]: atOrigin })).toEqual([]);
  const atEnd = structuredClone(entry);
  atEnd.image.markers[0].x =
    ((original.crop.x + original.crop.width) / original.width) * 100;
  expect(validateMechanicPreviews(records, { [id]: atEnd }).join('\n')).toMatch(
    /outside the cropped screenshot/,
  );
  const missing = structuredClone(entry);
  missing.title.en = '';
  missing.image.width++;
  expect(
    validateMechanicPreviews(records, { [id]: missing }).join('\n'),
  ).toMatch(/missing en/);
  expect(
    validateMechanicPreviews(records, { [id]: missing }).join('\n'),
  ).toMatch(/dimensions differ/);
});

for (const lang of ['ru', 'en'] as const) {
  for (const id of ids) {
    test(`${lang}/${id}: illustrated card preserves content and fits the reviewed viewports`, async ({
      page,
      request,
    }, testInfo) => {
      const card = getMechanicPreview(id, lang)!;
      await page.goto(route(lang, id));
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveText(card.title!);
      await expect(page.locator('.preview-description')).toHaveText(
        card.description,
      );
      await expect(page.locator('.preview-image img')).toHaveJSProperty(
        'naturalWidth',
        card.image.width,
      );
      await expect(page.locator('.preview-marker')).toHaveCount(
        card.image.markers.length,
      );
      for (const viewport of [
        { width: 298, height: 314 },
        { width: 375, height: 667 },
        { width: 516, height: 314 },
        { width: 1280, height: 720 },
        { width: 1920, height: 1080 },
      ]) {
        await page.setViewportSize(viewport);
        const dimensions = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        }));
        expect(dimensions, `${id} ${JSON.stringify(viewport)}`).toEqual(
          viewport,
        );
        for (const selector of ['h1', '.preview-description', '.preview-image'])
          await expect(page.locator(selector)).toBeInViewport({ ratio: 1 });
        for (const marker of await page.locator('.preview-marker').all())
          await expect(marker).toBeInViewport({ ratio: 1 });
        if (
          lang === 'ru' &&
          viewport.width === 298 &&
          [
            'game-mechanics--gm-grid-inventory',
            'dialogue--family-selection',
            'movement-platforming--t003',
          ].includes(id)
        )
          await page.screenshot({
            path: testInfo.outputPath('minimal-card.png'),
          });
      }
      await page.setViewportSize({ width: 298, height: 314 });
      for (let i = 0; i < card.image.markers.length; i++) {
        await page.locator('.preview-marker').nth(i).hover();
        const tooltip = page.locator(`#mechanic-tooltip-${i + 1}`);
        await expect(tooltip).toHaveText(card.image.markers[i].label);
        await expect(tooltip).toBeInViewport({ ratio: 1 });
        await page.keyboard.press('Escape');
      }
      const payload = await (
        await request.get(
          `/game-dev-db/api/v1/knowledge/${lang}/mechanic/${id}.json`,
        )
      ).json();
      expect(payload.record.attributes.preview).toEqual(card);
      expect(
        payload.record.sources.some(
          (s: { url: string }) => s.url === card.image.sourceUrl,
        ),
      ).toBe(true);
      const markdown = await (
        await request.get(
          `/game-dev-db/content/knowledge/${lang}/mechanic/${id}.md`,
        )
      ).text();
      expect(markdown).toContain(
        card.image.originalUrl === card.image.sourceUrl
          ? card.image.originalUrl
          : card.image.sourceUrl,
      );
      if ('sourceFrameSeconds' in card.image) {
        expect(markdown).toContain(card.image.originalUrl);
        expect(markdown).toContain(`${card.image.sourceFrameSeconds} s`);
      }
      expect(markdown).toContain(
        payload.record.sections.find(
          (section: { id: string; body: string }) => section.id === 'variants',
        ).body,
      );
    });
  }

  test(`${lang}: library follows editorial order and searches across languages`, async ({
    page,
  }) => {
    await page.goto(`/game-dev-db/${lang}/mechanics/cards/`);
    const ready = getMechanicCardQueue(
      buildKnowledge([], lang, []).records,
    ).filter((entry) => entry.illustrated);
    const links = page.locator('[data-card-library-item]');
    await expect(links).toHaveCount(ready.length);
    await expect(links.first()).toHaveAttribute(
      'href',
      route(lang, ready[0].record.id),
    );
    await page.getByRole('searchbox').fill('инвентарь');
    await expect(
      links.filter({
        has: page.getByRole('heading', {
          name: getMechanicPreview('game-mechanics--gm-grid-inventory', lang)!
            .title,
          exact: true,
        }),
      }),
    ).toBeVisible();
    await expect(links.first()).toBeHidden();
    await page.locator('[data-language-switch]').click();
    await expect(page.getByRole('searchbox')).toHaveValue('инвентарь');
    const otherLang = lang === 'ru' ? 'en' : 'ru';
    await expect(
      page.locator(
        `[data-card-library-item][href="${route(otherLang, 'game-mechanics--gm-grid-inventory')}"]`,
      ),
    ).toBeVisible();
    await page.getByRole('searchbox').fill('no-such-mechanic-zz');
    await expect(page.locator('[data-card-library-empty]')).toBeVisible();
  });
}
