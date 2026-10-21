import { expect, test } from '@playwright/test';
import { getMechanicPreview } from '../src/lib/mechanic-previews.mjs';

const route = (lang: string) =>
  `/game-dev-db/${lang}/knowledge/mechanic/shared-family-02/`;

for (const lang of ['ru', 'en'] as const) {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 298, height: 496 },
    { width: 298, height: 314 },
  ]) {
    test(`${lang} ${viewport.width}×${viewport.height}: marker tooltips support hover, keyboard, dismissal and viewport bounds`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto(route(lang));
      const labels = getMechanicPreview('shared-family-02', lang)!.image
        .markers;
      const buttons = page.locator('button.preview-marker');
      for (let i = 0; i < labels.length; i++) {
        const button = buttons.nth(i);
        const tooltip = page.locator(`#mechanic-tooltip-${i + 1}`);
        await expect(tooltip).toBeHidden();
        await button.hover();
        await expect(tooltip).toBeVisible();
        await expect(tooltip).toHaveText(labels[i].label);
        await expect(tooltip).toBeInViewport({ ratio: 1 });
        const bounds = await tooltip.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
        await tooltip.hover();
        await expect(tooltip).toBeVisible();
        if (i === 0 && lang === 'ru' && viewport.width === 1280)
          await page.screenshot({
            path: testInfo.outputPath('marker-tooltip.png'),
          });
        await page.keyboard.press('Escape');
        await expect(tooltip).toBeHidden();
        await button.focus();
        await expect(tooltip).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(button).toBeFocused();
        await expect(tooltip).toBeHidden();
        await page.locator('h1').click();
      }
      expect(
        await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        })),
      ).toEqual(viewport);
      await buttons.first().hover();
      await page.locator('h1').hover();
      await expect(page.locator('#mechanic-tooltip-1')).toBeHidden();
    });
  }

  test(`${lang}: touch toggles hints and outside taps dismiss them`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      hasTouch: true,
      isMobile: true,
      viewport: { width: 375, height: 667 },
    });
    const page = await context.newPage();
    await page.goto(route(lang));
    const buttons = page.locator('button.preview-marker');
    await buttons.first().tap();
    await expect(page.locator('#mechanic-tooltip-1')).toBeVisible();
    await buttons.last().tap();
    await expect(page.locator('#mechanic-tooltip-1')).toBeHidden();
    await expect(page.locator('#mechanic-tooltip-2')).toBeVisible();
    await buttons.last().tap();
    await expect(page.locator('#mechanic-tooltip-2')).toBeHidden();
    await buttons.first().tap();
    await page.locator('h1').tap();
    await expect(page.getByRole('tooltip')).toBeHidden();
    await context.close();
  });

  test(`${lang}: marker explanations remain available without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto(route(lang));
    const labels = getMechanicPreview('shared-family-02', lang)!.image.markers;
    for (let i = 0; i < labels.length; i++) {
      await expect(page.locator('.preview-marker').nth(i)).toHaveAttribute(
        'title',
        labels[i].label,
      );
      await expect(page.locator('.preview-legend')).toContainText(
        labels[i].label,
      );
    }
    await page.setViewportSize({ width: 298, height: 314 });
    await expect(page.locator('figcaption')).toBeHidden();
    await expect(page.locator('h1')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.preview-description')).toBeInViewport({
      ratio: 1,
    });
    for (let i = 0; i < labels.length; i++)
      await expect(page.locator('.preview-marker').nth(i)).toHaveAttribute(
        'title',
        labels[i].label,
      );
    await context.close();
  });
}
