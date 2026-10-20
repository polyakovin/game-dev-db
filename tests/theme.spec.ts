import { expect, test } from '@playwright/test';

const base = '/game-dev-db';
const storageKey = 'game-dev-db:theme';
const darkPaper = 'rgb(25, 29, 28)';
const lightPaper = 'rgb(247, 246, 242)';

test('system appearance follows changes until explicitly overridden', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${base}/ru/`);
  const root = page.locator('html');
  const system = page.getByRole('button', {
    name: 'Системная тема',
    exact: true,
  });
  await expect(root).toHaveCSS('background-color', darkPaper);
  await expect(system).toHaveAttribute('aria-pressed', 'true');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(root).toHaveCSS('background-color', lightPaper);
  await page.getByRole('button', { name: 'Тёмная тема', exact: true }).click();
  await expect(root).toHaveCSS('background-color', darkPaper);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(root).toHaveCSS('background-color', darkPaper);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    'content',
    '#191d1c',
  );
  await system.click();
  await expect(root).toHaveCSS('background-color', lightPaper);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBeNull();
});

test('saved choice applies before body rendering and survives reload, navigation and language switching', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`${base}/ru/`);
  await page.getByRole('button', { name: 'Тёмная тема', exact: true }).click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBe('dark');
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      if (document.body) {
        (window as Window & { themeAtBody?: string }).themeAtBody =
          document.documentElement.dataset.theme;
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.reload();
  await expect(page.locator('html')).toHaveCSS('background-color', darkPaper);
  expect(
    await page.evaluate(
      () => (window as Window & { themeAtBody?: string }).themeAtBody,
    ),
  ).toBe('dark');
  await page.locator(`a[href="${base}/ru/lessons/game-loop/"]`).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-language-switch]').click();
  await expect(page).toHaveURL(new RegExp(`${base}/en/lessons/game-loop/$`));
  await expect(page.getByRole('group', { name: 'Color theme' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Dark theme', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  expect(
    await page.evaluate(
      () => (window as Window & { themeAtBody?: string }).themeAtBody,
    ),
  ).toBe('dark');
  await page.getByRole('button', { name: 'Light theme', exact: true }).click();
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  await expect(page.locator('html')).toHaveCSS('background-color', lightPaper);
});

test('keyboard selection works when local storage is unavailable', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage is blocked', 'SecurityError');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`${base}/ru/`);
  const dark = page.getByRole('button', { name: 'Тёмная тема', exact: true });
  await page.getByRole('button', { name: 'Светлая тема', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(dark).toBeFocused();
  await expect(dark).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(dark).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveCSS('background-color', darkPaper);
  await page
    .getByRole('button', { name: 'Светлая тема', exact: true })
    .press('Space');
  await expect(page.locator('html')).toHaveCSS('background-color', lightPaper);
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});

test('invalid preferences fall back to system and choices synchronize across tabs', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${base}/ru/`);
  await page.evaluate(
    (key) => localStorage.setItem(key, 'invalid'),
    storageKey,
  );
  await page.reload();
  await expect(page.locator('[data-theme-choice="system"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('html')).toHaveCSS('background-color', darkPaper);
  const other = await context.newPage();
  await other.emulateMedia({ colorScheme: 'dark' });
  await other.goto(`${base}/en/`);
  await page.getByRole('button', { name: 'Светлая тема', exact: true }).click();
  await expect(other.locator('html')).toHaveCSS('background-color', lightPaper);
  await expect(
    other.getByRole('button', { name: 'Light theme', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await other
    .getByRole('button', { name: 'System theme', exact: true })
    .click();
  await expect(page.locator('html')).toHaveCSS('background-color', darkPaper);
  await expect(page.locator('[data-theme-choice="system"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await other.close();
});

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} appearance covers every section and fits a 320px viewport in both languages`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.setViewportSize({ width: 320, height: 812 });
    for (const lang of ['ru', 'en']) {
      for (const route of [
        '',
        'lessons/game-loop/',
        'mechanics/',
        'mechanics/detective/',
        'lenses/',
        'practice/',
        'resources/',
        'for-agents/',
      ]) {
        await page.goto(`${base}/${lang}/${route}`);
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('html')).toHaveCSS('color-scheme', theme);
        await expect(page.locator('[data-theme-controls]')).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${lang}/${route}`,
        ).toBe(true);
      }
    }
  });
}

test('dark appearance has readable text, controls and catalog illustration', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${base}/ru/`);
  await expect(page.locator('.lesson-card').first()).toHaveCSS(
    'background-color',
    'rgb(34, 39, 37)',
  );
  await expect(page.locator('.loop-diagram rect[x="24"]')).toHaveCSS(
    'fill',
    'rgb(34, 39, 37)',
  );
  const contrasts = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const luminance = (token: string) => {
      const hex = style.getPropertyValue(token).trim().slice(1);
      const channels = [0, 2, 4]
        .map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
        .map((value) =>
          value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        );
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    return [
      '--paper',
      '--surface',
      '--surface-alt',
      '--sidebar-bg',
      '--callout',
    ].flatMap((background) =>
      ['--ink', '--muted', '--accent'].map((foreground) => ({
        background,
        foreground,
        ratio: (luminance(foreground) + 0.05) / (luminance(background) + 0.05),
      })),
    );
  });
  for (const pair of contrasts)
    expect(
      pair.ratio,
      `${pair.foreground} on ${pair.background}`,
    ).toBeGreaterThanOrEqual(4.5);
  await page.locator('#lesson-search').fill('game-loop');
  await expect(page.locator('[data-lesson-card]:visible')).toHaveCount(1);
});

test('no-JavaScript reading follows system appearance and omits inactive controls', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
    baseURL,
  });
  const page = await context.newPage();
  for (const lang of ['ru', 'en']) {
    await page.goto(`${base}/${lang}/`);
    await expect(page.locator('html')).toHaveCSS('background-color', darkPaper);
    await expect(page.locator('[data-theme-controls]')).toBeHidden();
    await page
      .locator(`a[href="${base}/${lang}/lessons/game-loop/"]`)
      .first()
      .click();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('html')).toHaveCSS('background-color', darkPaper);
  }
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('html')).toHaveCSS('background-color', lightPaper);
  await context.close();
});

test('standalone error page respects saved appearance and printing uses light colors', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(`${base}/ru/`);
  await page.getByRole('button', { name: 'Тёмная тема', exact: true }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('html')).toHaveCSS('background-color', lightPaper);
  await expect(page.locator('[data-theme-controls]')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await page.goto(`${base}/404/`);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('background-color', darkPaper);
  await expect(
    page.getByRole('link', { name: 'На главную', exact: true }),
  ).toHaveAttribute('href', `${base}/ru/`);
});
