import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';
import {
  learningPathData,
  learningPathRecords,
  validateLearningPaths,
} from '../src/lib/learning-paths.mjs';
import { practiceSource } from '../src/lib/practice.mjs';
import { lensData } from '../src/lib/lenses.mjs';

const base = '/game-dev-db';
const available = {
  lessons: ['ru', 'en'].flatMap((lang) =>
    readdirSync(new URL(`../src/content/lessons/${lang}/`, import.meta.url))
      .filter((file) => file.endsWith('.md'))
      .map((file) => `${lang}/${file.slice(0, -3)}`),
  ),
  practice: practiceSource.tasks.map((task) => task.id),
  lenses: lensData.lenses.map((lens) => lens.id),
};

test('path validation catches broken translations, references and membership', () => {
  expect(validateLearningPaths(available)).toEqual([]);
  const missingTranslation = {
    ...available,
    lessons: available.lessons.filter((id) => id !== 'en/npc-perception'),
  };
  expect(validateLearningPaths(missingTranslation).join()).toContain(
    'en/npc-perception',
  );
  const broken = structuredClone(learningPathData);
  broken[0].practice.push('missing-exercise');
  broken[1].lenses.push('missing-lens');
  broken[1].lessons.push(broken[1].lessons[0]);
  broken[2].updatedAt = '2026-02-30';
  broken[3].title.en = '';
  const errors = validateLearningPaths(available, broken).join();
  for (const message of [
    'missing-exercise',
    'missing-lens',
    'duplicate lessons reference',
    'invalid update date',
    'title.en',
  ])
    expect(errors).toContain(message);
  broken[1].id = broken[0].id;
  expect(validateLearningPaths(available, broken).join()).toContain(
    'duplicate identity',
  );
});

test('path export matches source and manifest exposes the additive dataset', async ({
  request,
}) => {
  const response = await request.get(`${base}/api/v1/learning-paths.json`);
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(payload.schemaVersion).toBe(1);
  expect(payload.license).toBe('CC-BY-4.0');
  expect(payload.paths).toEqual(learningPathRecords());
  const manifest = await (
    await request.get(`${base}/api/v1/manifest.json`)
  ).json();
  expect(manifest.counts.learningPaths).toBe(learningPathData.length);
  expect(manifest.counts.translationPairs).toBeGreaterThanOrEqual(20);
  expect(manifest.endpoints.learningPaths).toContain(
    `${base}/api/v1/learning-paths.json`,
  );
});

for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: discover paths, follow sequence and switch path language`, async ({
    page,
  }) => {
    await page.goto(`${base}/${lang}/`);
    await expect(page.locator('[data-learning-path-card]')).toHaveCount(
      learningPathData.length,
    );
    for (const route of learningPathData) {
      await page.goto(`${base}/${lang}/learn/${route.id}/`);
      await expect(page.locator('h1')).toHaveText(route.title[lang]);
      expect(
        await page
          .locator('[data-path-lesson]')
          .evaluateAll((links) =>
            links.map((link) => link.getAttribute('href')!.split('/').at(-2)),
          ),
      ).toEqual(route.lessons);
      await expect(page.locator('[data-language-switch]')).toHaveAttribute(
        'href',
        `${base}/${lang === 'ru' ? 'en' : 'ru'}/learn/${route.id}/`,
      );
      await expect(page.locator('[data-path-practice]')).toHaveCount(
        route.practice.length,
      );
      await expect(page.locator('[data-path-lens]')).toHaveCount(
        route.lenses.length,
      );
    }
    await page.locator('[data-language-switch]').click();
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      lang === 'ru' ? 'en' : 'ru',
    );
    await page.goto(`${base}/${lang}/learn/npc-behavior/`);
    await page.locator('[data-path-lesson]').first().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/lessons/npc-perception/$`));
    await expect(page.locator('[data-lesson-path] a[rel="prev"]')).toHaveCount(
      0,
    );
    await page.locator('[data-lesson-path] a[rel="next"]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/lessons/npc-action-selection/$`));
    await expect(
      page.locator('[data-lesson-path] a[rel="prev"]'),
    ).toHaveAttribute('href', `${base}/${lang}/lessons/npc-perception/`);
    await page.locator('[data-lesson-path] a[rel="next"]').click();
    await expect(page).toHaveURL(new RegExp(`/lessons/npc-pathfinding/$`));
    await expect(page.locator('[data-lesson-path] a[rel="next"]')).toHaveCount(
      0,
    );
    await page.goto(`${base}/${lang}/?q=npc&category=engineering`);
    await expect(page.locator('[data-lesson-card]:visible')).toHaveCount(3);
  });

  test(`${lang}: path and new lessons fit narrow screens in both themes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      for (const route of learningPathData) {
        for (const url of [
          `learn/${route.id}/`,
          `lessons/${route.lessons[1]}/`,
        ]) {
          await page.goto(`${base}/${lang}/${url}`);
          await expect(page.locator('h1')).toBeVisible();
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
            url,
          ).toBe(true);
        }
      }
    }
  });

  test(`${lang}: full path works without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
    });
    const page = await context.newPage();
    await page.goto(`${base}/${lang}/`);
    await page
      .locator('[data-learning-path-card][href$="/learn/level-design/"]')
      .click();
    await expect(page.locator('[data-path-lesson]')).toHaveCount(3);
    await page.locator('[data-path-lesson]').first().click();
    await expect(page.locator('article h2')).toHaveCount(7);
    await page.locator('[data-lesson-path] a[rel="next"]').click();
    await expect(page).toHaveURL(new RegExp('/lessons/level-wayfinding/$'));
    await page.locator('[data-language-switch]').click();
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      lang === 'ru' ? 'en' : 'ru',
    );
    await context.close();
  });
}
