import { expect, test, type Locator, type Page } from '@playwright/test';
import { BASE } from '../src/lib/site-config.mjs';

const cards: Record<string, { id: string; secondary?: string }> = {
  'precision-jump': { id: 'movement-platforming--t003' },
  'timed-parry': { id: 'melee-combat--t016', secondary: 'opponent' },
  'line-of-sight': { id: 'stealth-infiltration--t031', secondary: 'guard' },
  'independent-aim': {
    id: 'shooting-projectiles--t029',
    secondary: 'opponent',
  },
  'asymmetric-roles': { id: 'social-cooperation--t204', secondary: 'partner' },
};
const identity = (kind: string) => cards[kind].id;
const route = (kind: string, lang = 'ru') =>
  `${BASE}/${lang}/knowledge/mechanic/${identity(kind)}/`;

async function openDemo(page: Page, kind = 'line-of-sight', lang = 'ru') {
  await page.goto(route(kind, lang));
  const root = page.locator('[data-mechanic-demo]');
  await expect(root).toHaveAttribute('data-ready', 'true');
  await expect(root).toHaveAttribute('data-kind', kind);
  return root;
}

async function seek(root: Locator, seconds: number) {
  await root.locator('[data-demo-timeline]').evaluate((element, time) => {
    const input = element as HTMLInputElement;
    input.value = String(time);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, seconds);
  await expect(root).toHaveAttribute('data-playing', 'false');
}

async function scene(root: Locator) {
  return root.locator('[data-demo-scene]').evaluate((svg) => svg.innerHTML);
}

async function rigPoses(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<SVGElement>('[data-demo-actor]')].map(
      (actor) => ({
        role: actor.dataset.demoActor,
        parts: [...actor.querySelectorAll<SVGElement>('[data-rig-part]')].map(
          (part) => ({
            part: part.dataset.rigPart,
            transform: part.getAttribute('transform'),
            opacity: part.getAttribute('opacity'),
          }),
        ),
      }),
    ),
  );
}

async function expectActorsInFrame(root: Locator) {
  const bounds = await root.locator('[data-demo-scene]').boundingBox();
  expect(bounds).not.toBeNull();
  for (const actor of await root.locator('[data-demo-actor]').all()) {
    const role = await actor.getAttribute('data-demo-actor');
    await expect(actor).toBeVisible();
    const box = await actor.boundingBox();
    expect(box, `${role} has a rendered extent`).not.toBeNull();
    expect(box!.x, `${role} left`).toBeGreaterThanOrEqual(bounds!.x - 1);
    expect(box!.y, `${role} top`).toBeGreaterThanOrEqual(bounds!.y - 1);
    expect(box!.x + box!.width, `${role} right`).toBeLessThanOrEqual(
      bounds!.x + bounds!.width + 1,
    );
    expect(box!.y + box!.height, `${role} bottom`).toBeLessThanOrEqual(
      bounds!.y + bounds!.height + 1,
    );
  }
}

for (const [kind, { secondary }] of Object.entries(cards)) {
  test(`${kind}: all phases render articulated characters and seeking is repeatable`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const root = await openDemo(page, kind);
    await expect(root).toHaveAttribute('data-playing', 'false');
    await expect(root.locator('[data-demo-actor]')).toHaveCount(
      secondary ? 2 : 1,
    );
    if (secondary)
      await expect(
        root.locator(
          `[data-demo-actor="${secondary}"] [data-character-art="kern"]`,
        ),
      ).toHaveCount(1);
    await expect(root.getByText(/^(Босс|Boss)$/)).toHaveCount(0);
    await expect(
      root.locator('[data-demo-actor="player"] [data-character-art="tavi"]'),
    ).toHaveCount(1);
    await expect(root.locator('[data-demo-phase]')).toHaveCount(3);

    for (const phase of [0, 1, 2]) {
      await root.locator(`[data-demo-phase="${phase}"]`).click();
      await expect(root).toHaveAttribute('data-phase', String(phase));
      await expect(root).toHaveAttribute('data-playing', 'false');
      await expect(root.locator('[data-demo-explanation]')).not.toBeEmpty();
      await expectActorsInFrame(root);
    }

    await root.locator('[data-demo-phase="1"]').click();
    const target = Number(
      await root.locator('[data-demo-timeline]').inputValue(),
    );
    const selectedFrame = await scene(root);
    await seek(root, 0.3);
    expect(await scene(root)).not.toBe(selectedFrame);
    await seek(root, target);
    expect(await scene(root)).toBe(selectedFrame);

    const duration = Number(
      await root.locator('[data-demo-timeline]').getAttribute('max'),
    );
    for (const fraction of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      await seek(root, Number((duration * fraction).toFixed(2)));
      await expectActorsInFrame(root);
    }
    expect(errors).toEqual([]);
  });
}

test('playback freezes every SVG pose and effect; timeline and screenshot tabs work with the keyboard', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const root = await openDemo(page);
  await expect(root).toHaveAttribute('data-playing', 'true');
  await expect
    .poll(async () => Number(await root.getAttribute('data-time')))
    .toBeGreaterThan(0.1);

  await root.locator('[data-demo-toggle]').click();
  await expect(root).toHaveAttribute('data-playing', 'false');
  const pausedScene = await scene(root);
  await page.waitForTimeout(250);
  expect(await scene(root)).toBe(pausedScene);

  const timeline = root.locator('[data-demo-timeline]');
  await timeline.focus();
  const before = Number(await timeline.inputValue());
  await page.keyboard.press('ArrowRight');
  expect(Number(await timeline.inputValue())).toBeGreaterThan(before);
  await expect(root).toHaveAttribute('data-playing', 'false');

  await root.locator('[data-demo-speed]').selectOption('0.5');
  await root.locator('[data-demo-toggle]').click();
  await expect(root).toHaveAttribute('data-playing', 'true');
  const example = root.locator('[data-demo-tab="example"]');
  await example.focus();
  await page.keyboard.press('Enter');
  await expect(example).toHaveAttribute('aria-selected', 'true');
  await expect(root.locator('[data-demo-panel="animation"]')).toBeHidden();
  await expect(root.locator('[data-demo-panel="example"] img')).toBeVisible();
  const hiddenScene = await scene(root);
  await page.waitForTimeout(200);
  expect(await scene(root)).toBe(hiddenScene);

  await root.locator('[data-demo-tab="animation"]').click();
  await expect(root.locator('[data-demo-scene]')).toBeVisible();
  await expect(root).toHaveAttribute('data-playing', 'true');
  await root.locator('[data-demo-toggle]').click();
  await root.locator('[data-demo-tab="example"]').click();
  await root.locator('[data-demo-tab="animation"]').click();
  await expect(root).toHaveAttribute('data-playing', 'false');
  await page.keyboard.press('End');
  await expect(example).toBeFocused();
  await expect(example).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(root.locator('[data-demo-tab="animation"]')).toBeFocused();
  await expect(root.locator('[data-demo-tab="animation"]')).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('hidden documents stop the clock and preserve an explicit pause', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const root = await openDemo(page);
  await expect(root).toHaveAttribute('data-playing', 'true');
  const visibility = async (hidden: boolean) => {
    await page.evaluate((value) => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => value,
      });
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => (value ? 'hidden' : 'visible'),
      });
      document.dispatchEvent(new Event('visibilitychange'));
    }, hidden);
  };
  const time = async () => Number(await root.getAttribute('data-time'));
  await visibility(true);
  const hiddenScene = await scene(root);
  const hiddenTime = await time();
  await page.waitForTimeout(200);
  expect(await scene(root)).toBe(hiddenScene);
  expect(await time()).toBe(hiddenTime);
  await visibility(false);
  await expect.poll(time).toBeGreaterThan(hiddenTime);
  await root.locator('[data-demo-toggle]').click();
  await expect(root).toHaveAttribute('data-playing', 'false');
  const pausedScene = await scene(root);
  const pausedTime = await time();
  await visibility(true);
  await visibility(false);
  await page.waitForTimeout(200);
  expect(await scene(root)).toBe(pausedScene);
  expect(await time()).toBe(pausedTime);
});

test('reduced motion starts still, allows explicit playback and keeps restart still', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const root = await openDemo(page, 'independent-aim', 'en');
  await expect(root).toHaveAttribute('data-playing', 'false');
  const firstFrame = await scene(root);
  await page.waitForTimeout(200);
  expect(await scene(root)).toBe(firstFrame);
  await root.locator('[data-demo-toggle]').click();
  await expect(root).toHaveAttribute('data-playing', 'true');
  await expect
    .poll(async () => Number(await root.getAttribute('data-time')))
    .toBeGreaterThan(0.12);
  await root.locator('[data-demo-restart]').click();
  await expect(root).toHaveAttribute('data-playing', 'false');
  await expect(root.locator('[data-demo-timeline]')).toHaveValue('0');
  expect(await scene(root)).toBe(firstFrame);
});

for (const lang of ['ru', 'en'] as const) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${lang} ${colorScheme}: mobile and desktop retain the scene, controls and source`, async ({
      page,
    }, testInfo) => {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      const root = await openDemo(page, 'precision-jump', lang);
      for (const viewport of [
        { width: 375, height: 667 },
        { width: 1280, height: 720 },
      ]) {
        await page.setViewportSize(viewport);
        await page.evaluate(() => document.fonts.ready);
        await expect(root.locator('[data-demo-scene]')).toBeVisible();
        await expect(root.locator('[data-demo-toggle]')).toBeVisible();
        await expect(root.locator('[data-demo-timeline]')).toBeVisible();
        await expect(root.locator('[data-demo-explanation]')).toBeVisible();
        await expectActorsInFrame(root);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(viewport.width);
        await root.locator('[data-demo-speed]').focus();
        await expect(root.locator('[data-demo-speed]')).toBeInViewport();
        await root.locator('[data-demo-tab="example"]').click();
        const image = root.locator('[data-demo-panel="example"] img');
        await expect(image).toBeVisible();
        await expect
          .poll(() =>
            image.evaluate((img) => (img as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
        await root.locator('[data-demo-tab="animation"]').click();
        await page.screenshot({
          path: testInfo.outputPath(
            `demo-${lang}-${colorScheme}-${viewport.width}.png`,
          ),
          fullPage: true,
        });
      }
    });
  }

  test(`${lang}: no-JavaScript reading retains the scene, phase text, screenshot and export parity`, async ({
    browser,
    baseURL,
    request,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      viewport: { width: 375, height: 667 },
    });
    const page = await context.newPage();
    await page.goto(route('line-of-sight', lang));
    const root = page.locator('[data-mechanic-demo]');
    await expect(root.locator('[data-demo-scene]')).toBeVisible();
    await expect(root.locator('[data-demo-panel="example"] img')).toBeVisible();
    await expect(root.locator('[data-demo-toggle]')).toBeHidden();
    await expect(root.locator('[data-demo-timeline]')).toBeHidden();
    const hydratedContext = await browser.newContext({
      baseURL,
      reducedMotion: 'reduce',
      viewport: { width: 375, height: 667 },
    });
    const hydrated = await hydratedContext.newPage();
    await openDemo(hydrated, 'line-of-sight', lang);
    expect(await rigPoses(hydrated)).toEqual(await rigPoses(page));
    await hydratedContext.close();
    const payload = await (
      await request.get(
        `${BASE}/api/v1/knowledge/${lang}/mechanic/${identity('line-of-sight')}.json`,
      )
    ).json();
    const descriptor = payload.record.attributes.demonstration;
    expect(descriptor.kind).toBe('line-of-sight');
    await root.locator('.demo-reading summary').click();
    await expect(root).toContainText(descriptor.description);
    for (const phase of descriptor.phases) {
      await expect(root).toContainText(phase.title);
      await expect(root).toContainText(phase.description);
      await expect(root.locator('.demo-reading')).toContainText(
        phase.description,
      );
    }
    await expect(root.locator('.demo-reading ol')).toBeVisible();
    await expect(
      root.locator(`a[href="${descriptor.sourceUrl}"]`),
    ).toBeVisible();
    await expect(
      root.locator('a[href="https://creativecommons.org/licenses/by/4.0/"]'),
    ).toBeVisible();
    const markdown = await (
      await request.get(
        `${BASE}/content/knowledge/${lang}/mechanic/${identity('line-of-sight')}.md`,
      )
    ).text();
    expect(markdown).toContain(descriptor.description);
    expect(markdown).toContain(descriptor.sourceUrl);
    for (const phase of descriptor.phases) {
      expect(markdown).toContain(phase.title);
      expect(markdown).toContain(phase.description);
    }
    expect(markdown).toContain(
      payload.record.attributes.preview.image.sourceUrl,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(375);
    await context.close();
  });
}

test('mechanics without a demonstration keep the original illustrated card', async ({
  page,
}) => {
  await page.goto(`${BASE}/ru/knowledge/mechanic/shared-family-02/`);
  await expect(page.locator('[data-mechanic-demo]')).toHaveCount(0);
  await expect(page.locator('.preview-image img')).toBeVisible();
  await expect(page.locator('.preview-marker')).toHaveCount(2);
});

test('boss cards in either language keep their screenshots without the player or export descriptor', async ({
  page,
  request,
}) => {
  for (const lang of ['ru', 'en']) {
    const id = 'boss-fight-atlas--boss-charge';
    await page.goto(`${BASE}/${lang}/knowledge/mechanic/${id}/`);
    await expect(page.locator('[data-mechanic-demo]')).toHaveCount(0);
    await expect(page.locator('.preview-image img')).toBeVisible();
    const response = await request.get(
      `${BASE}/api/v1/knowledge/${lang}/mechanic/${id}.json`,
    );
    expect(
      (await response.json()).record.attributes.demonstration,
    ).toBeUndefined();
  }
});
