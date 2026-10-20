import { expect, test } from '@playwright/test';
import { overviewCatalogs } from '../src/lib/mechanic-overviews.mjs';
import { validateMechanicOverviews } from '../src/lib/mechanic-overview-validation.mjs';
import { getMechanics } from '../src/lib/mechanics.mjs';
import {
  getMechanicDirections,
  mechanicDirectionData,
} from '../src/lib/mechanic-directions.mjs';
import reusedFamilies from '../docs/mechanic-content-reuse.json' with { type: 'json' };

test('all 329 directions have substantive content and audited existing targets remain aligned', () => {
  expect(
    overviewCatalogs.map((catalog) => catalog.overviewGroupId).sort(),
  ).toEqual(mechanicDirectionData.groups.map((group) => group.id).sort());
  for (const lang of ['ru', 'en'] as const) {
    const index = getMechanicDirections(lang);
    expect(index.counts).toMatchObject({
      directions: 329,
      readyDirections: 329,
      inDevelopment: 0,
    });
    expect(
      index.groups
        .flatMap((group) => group.directions)
        .every((direction) => direction.url),
    ).toBe(true);
  }
  for (const association of reusedFamilies) {
    const direction = mechanicDirectionData.groups
      .flatMap((group) => group.directions)
      .find((entry) => entry.id === association.directionId)!;
    expect('materialRef' in direction && direction.materialRef).toEqual({
      catalogId: association.catalogId,
      familyId: association.familyId,
    });
    const family = getMechanics('ru')
      .find((catalog) => catalog.id === association.catalogId)!
      .families.find((entry) => entry.id === association.familyId)!;
    expect(family.branches.flatMap((branch) => branch.variants).length).toBe(
      association.variants,
    );
  }
});

test('published overviews have complete paired content and reject missing checks or duplicate variants', () => {
  expect(validateMechanicOverviews()).toEqual([]);
  const source = structuredClone(overviewCatalogs);
  source[0].families[0].prototypeCheck.en = '';
  expect(validateMechanicOverviews(source).join()).toContain(
    'prototypeCheck.en',
  );
  const repeated = structuredClone(overviewCatalogs);
  const variants = repeated[0].families[0].branches[0].variants;
  variants[1].text.en = variants[0].text.en;
  expect(validateMechanicOverviews(repeated).join()).toContain(
    'distinct explained en variants',
  );
});

for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: a direction opens its substantive overview and exports the prototype check`, async ({
    page,
    request,
  }) => {
    const source = overviewCatalogs[0];
    const family = source.families[0];
    await page.goto(`/game-dev-db/${lang}/mechanics/`);
    await page.locator(`#${family.id} a`).click();
    await expect(page).toHaveURL(
      `/game-dev-db/${lang}/mechanics/${source.id}/#${family.id}`,
    );
    await expect(
      page.locator(`[data-family][id="${family.id}"]`),
    ).toHaveAttribute('open', '');
    await expect(
      page.locator(`[id="${family.id}"] .mechanic-example`).first(),
    ).toContainText(family.prototypeCheck[lang]);
    const catalog = getMechanics(lang).find((item) => item.id === source.id)!;
    const markdown = await request.get(new URL(catalog.markdownUrl).pathname);
    expect(await markdown.text()).toContain(family.prototypeCheck[lang]);
  });
}
