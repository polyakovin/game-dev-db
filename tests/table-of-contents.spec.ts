import { expect, test } from '@playwright/test';

const base = '/game-dev-db';

for (const lang of ['ru', 'en']) {
  for (const kind of ['lessons/game-loop', 'mechanics/point-and-click']) {
    const route = `${base}/${lang}/${kind}/`;

    test(`${lang}/${kind}: current section follows scrolling and keyboard anchors`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(route);
      const links = page.locator('[data-toc] a');
      const current = page.locator('[data-toc] [aria-current="location"]');
      await expect(current).toHaveCount(1);
      await expect(links.first()).toHaveAttribute('aria-current', 'location');

      const fourth = links.nth(3);
      await fourth.focus();
      const secondHash = (await links.nth(1).getAttribute('href'))!;
      await page.locator(secondHash).evaluate((target) => {
        window.scrollTo(0, target.getBoundingClientRect().top + scrollY - 24);
      });
      await expect(links.nth(1)).toHaveAttribute('aria-current', 'location');
      await expect(page).toHaveURL(new RegExp(`${route}$`));
      await expect(fourth).toBeFocused();

      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(links.first()).toHaveAttribute('aria-current', 'location');
      const fourthHash = (await fourth.getAttribute('href'))!;
      await fourth.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(
        (url) => decodeURIComponent(url.hash) === fourthHash,
      );
      await expect(fourth).toHaveAttribute('aria-current', 'location');

      for (const appearance of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: appearance });
        const colors = await fourth.evaluate((link) => ({
          text: getComputedStyle(link).color,
          marker: getComputedStyle(link, '::before').backgroundColor,
          width: getComputedStyle(link, '::before').width,
        }));
        expect(colors.marker).toBe(colors.text);
        expect(colors.width).toBe('3px');
      }

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(links.last()).toHaveAttribute('aria-current', 'location');
      await expect(current).toHaveCount(1);
      expect(errors).toEqual([]);

      await page.setViewportSize({ width: 375, height: 812 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    });

    test(`${lang}/${kind}: native TOC works without JavaScript`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        baseURL,
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.goto(route);
      await expect(page.locator('[data-toc] [aria-current]')).toHaveCount(0);
      await page.locator('[data-toc] a[href="#sources"]').click();
      await expect(page).toHaveURL(new RegExp(`${route}#sources$`));
      await expect(page.locator('#sources')).toBeInViewport();
      await context.close();
    });
  }

  test(`${lang}: mechanic reading position handles deep links, long sections and filters`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(
      `${base}/${lang}/mechanics/point-and-click/#family-01-variant-1`,
    );
    const first = page.locator('[data-toc] a[href="#section-1"]');
    await expect(first).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('#family-01')).toHaveAttribute('open', '');

    await page.locator('[data-expand]').click();
    await page.locator('#section-1').evaluate((section) => {
      window.scrollTo(
        0,
        section.getBoundingClientRect().top +
          scrollY +
          section.clientHeight / 2,
      );
    });
    await expect(first).toHaveAttribute('aria-current', 'location');
    expect(
      await page
        .locator('#section-1 h2')
        .evaluate((heading) => heading.getBoundingClientRect().bottom),
    ).toBeLessThan(0);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('#mechanic-section').selectOption('section-2');
    await expect(page.locator('#section-1')).toBeHidden();
    await expect(
      page.locator('[data-toc] a[href="#section-2"]'),
    ).toHaveAttribute('aria-current', 'location');
    await expect(first).not.toHaveAttribute('aria-current');
    await page.locator('[data-reset]').first().click();
    await expect(first).toHaveAttribute('aria-current', 'location');
  });
}
