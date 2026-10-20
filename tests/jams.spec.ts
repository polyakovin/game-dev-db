import { expect, test, type Page } from '@playwright/test';
import { load } from 'cheerio';
import { jamData, jamSnapshot, validateJams } from '../src/lib/jams.mjs';
import { currentJams, jamStatus } from '../src/lib/jam-time.mjs';

const base = '/game-dev-db';
const instant = '2030-01-01T00:00:00Z';

test('jam time rules use inclusive starts, exclusive deadlines, offsets and useful ordering', () => {
  const event = {
    id: 'open',
    startsAt: '2029-12-31T23:59:59Z',
    endsAt: '2030-01-01T00:00:02Z',
  };
  expect(jamStatus(event, Date.parse(event.startsAt) - 1)).toBe('upcoming');
  expect(jamStatus(event, Date.parse(event.startsAt))).toBe('open');
  expect(jamStatus(event, Date.parse(event.endsAt) - 1)).toBe('open');
  expect(jamStatus(event, Date.parse(event.endsAt))).toBe('closed');
  expect(
    jamStatus(
      { ...event, endsAt: '2030-01-01T03:00:00+03:00' },
      Date.parse(instant),
    ),
  ).toBe('closed');
  const future = {
    id: 'future',
    startsAt: '2030-01-02T00:00:00Z',
    endsAt: '2030-01-03T00:00:00Z',
  };
  const later = {
    ...future,
    id: 'later',
    startsAt: '2030-01-03T00:00:00Z',
    endsAt: '2030-01-04T00:00:00Z',
  };
  const long = { ...event, id: 'long', endsAt: '2030-02-01T00:00:00Z' };
  const expired = { ...event, id: 'expired', endsAt: instant };
  const events = [later, long, expired, future, event];
  expect(currentJams(events, Date.parse(instant)).map((e) => e.id)).toEqual([
    'open',
    'long',
    'future',
    'later',
  ]);
  expect(events[0].id).toBe('later');
  expect(jamSnapshot(new Date('2099-01-01T00:00:00Z')).events).toEqual([]);
});

test('jam validation rejects broken identities, translations, URLs and deadlines', () => {
  expect(validateJams()).toEqual([]);
  const mutations: Array<[(data: typeof jamData) => void, string]> = [
    [
      (d) => {
        d.events[1].id = d.events[0].id;
      },
      'duplicate id',
    ],
    [
      (d) => {
        d.events[1].url = d.events[0].url;
      },
      'duplicate URL',
    ],
    [
      (d) => {
        d.events[0].requirements.en = '';
      },
      'missing en',
    ],
    [
      (d) => {
        d.calendars[0].description.ru = '';
      },
      'missing ru',
    ],
    [
      (d) => {
        d.events[0].url = 'https://user:secret@example.com';
      },
      'credential-free HTTPS',
    ],
    [
      (d) => {
        d.calendars[0].url = 'javascript:alert(1)';
      },
      'credential-free HTTPS',
    ],
    [
      (d) => {
        d.events[0].startsAt = '2026-10-16T22:00:00';
      },
      'timestamp with timezone',
    ],
    [
      (d) => {
        d.events[0].endsAt = d.events[0].startsAt;
      },
      'deadline must follow start',
    ],
    [
      (d) => {
        d.events[0].endsAt = '2026-02-30T00:00:00Z';
      },
      'timestamp with timezone',
    ],
    [
      (d) => {
        d.events[0].verifiedAt = '2026-02-30';
      },
      'invalid verifiedAt',
    ],
  ];
  for (const [mutate, error] of mutations) {
    const copy = structuredClone(jamData);
    mutate(copy);
    expect(validateJams(copy).join('\n')).toContain(error);
  }
});

for (const lang of ['ru', 'en'] as const) {
  test(`${lang}: jam discovery, localized source content and keyboard language switch`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/${lang}/`);
    await page.locator('[data-jams-link]').click();
    await expect(page).toHaveURL(`${base}/${lang}/jams/`);
    await expect(
      page.locator('.sidebar a[aria-current="page"]'),
    ).toHaveAttribute('href', `${base}/${lang}/jams/`);
    const generatedAt = await page
      .locator('[data-jam-generated-at]')
      .getAttribute('datetime');
    const events = currentJams(jamData.events, Date.parse(generatedAt!));
    await expect(page.locator('[data-jam]:visible')).toHaveCount(events.length);
    await expect(page.locator('[data-jam-count]')).toHaveText(
      String(events.length),
    );
    for (const event of events) {
      const card = page.locator(`[data-jam-id="${event.id}"]`);
      await expect(card.locator('h3')).toHaveText(event.title[lang]);
      await expect(card.locator('.jam-requirements')).toHaveText(
        event.requirements[lang],
      );
      await expect(card.locator('.jam-entry')).toHaveAttribute(
        'href',
        event.url,
      );
      await expect(card.locator('time').nth(1)).toHaveAttribute(
        'datetime',
        event.endsAt,
      );
    }
    await expect(page.locator('[data-jam-calendar]')).toHaveCount(
      jamData.calendars.length,
    );
    await page.locator('[data-language-switch]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(
      `${base}/${lang === 'ru' ? 'en' : 'ru'}/jams/`,
    );
    expect(errors).toEqual([]);
  });

  test(`${lang}: jam calendars and cards fit mobile in both themes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${base}/${lang}/jams/`);
    for (const theme of ['light', 'dark']) {
      await page.locator(`[data-theme-choice="${theme}"]`).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await expect(
        page.locator(`.mobile-nav a[href="${base}/${lang}/jams/"]`),
      ).toBeVisible();
    }
    await page.locator('.jams-calendar-jump').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#jam-calendars-title')).toBeInViewport();
  });
}

// Serve the actual page and script with deterministic event fixtures, so these
// regression checks remain meaningful after every curated edition has expired.
async function fixturePage(page: Page) {
  await page.route(`**${base}/ru/jams/`, async (route) => {
    const response = await route.fetch();
    const $ = load(await response.text());
    const fixtures = [
      { id: 'expired', startsAt: '2029-12-30T00:00:00Z', endsAt: instant },
      {
        id: 'open',
        startsAt: '2029-12-31T00:00:00Z',
        endsAt: '2030-01-01T00:00:02Z',
      },
      {
        id: 'upcoming',
        startsAt: '2030-01-01T00:00:01Z',
        endsAt: '2030-01-01T00:00:03Z',
      },
    ];
    $('[data-jam-list]').html(
      fixtures
        .map(
          (e) =>
            `<article data-jam data-jam-id="${e.id}" data-starts-at="${e.startsAt}" data-ends-at="${e.endsAt}"><h3><a href="https://example.com/${e.id}">${e.id}</a></h3><span data-jam-status>Upcoming</span></article>`,
        )
        .join(''),
    );
    await route.fulfill({ response, body: $.html() });
  });
}

test('stale pages discard expired cards at load and transition while left open', async ({
  page,
}) => {
  await page.clock.install({ time: new Date(instant) });
  await fixturePage(page);
  await page.goto(`${base}/ru/jams/`);
  await expect(page.locator('[data-jam-id="expired"]')).toBeHidden();
  await expect(page.locator('[data-jam-count]')).toHaveText('2');
  await expect(
    page.locator('[data-jam-id="upcoming"] [data-jam-status]'),
  ).toHaveText('Скоро старт');
  await page.locator('[data-jam-id="open"] a').focus();
  await page.clock.runFor(1000);
  await expect(page.locator('[data-jam-id="open"] a')).toBeFocused();
  await expect(
    page.locator('[data-jam-id="upcoming"] [data-jam-status]'),
  ).toHaveText('Идёт приём работ');
  await page.clock.runFor(1000);
  await expect(page.locator('[data-jam-id="open"]')).toBeHidden();
  await expect(page.locator('[data-jam-count]')).toHaveText('1');
  await page.clock.runFor(1000);
  await expect(page.locator('[data-jam]:visible')).toHaveCount(0);
  await expect(page.locator('[data-jam-empty]')).toBeVisible();
  await expect(page.locator('[data-jam-count]')).toHaveText('0');
  await expect(page.locator('[data-jam-calendar]')).toHaveCount(
    jamData.calendars.length,
  );
});

test('returning to a suspended tab refreshes deadlines against the current clock', async ({
  page,
}) => {
  await page.clock.install({ time: new Date(instant) });
  await fixturePage(page);
  await page.goto(`${base}/ru/jams/`);
  await page.clock.setSystemTime(new Date('2030-01-01T00:00:04Z'));
  await page.evaluate(() => window.dispatchEvent(new Event('pageshow')));
  await expect(page.locator('[data-jam]:visible')).toHaveCount(0);
  await expect(page.locator('[data-jam-empty]')).toBeVisible();
});

test('jam build snapshot and calendars remain readable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 375, height: 812 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  for (const lang of ['ru', 'en']) {
    await page.goto(`${base}/${lang}/jams/`);
    const timestamp = await page
      .locator('[data-jam-generated-at]')
      .getAttribute('datetime');
    await expect(page.locator('[data-jam]')).toHaveCount(
      currentJams(jamData.events, Date.parse(timestamp!)).length,
    );
    await expect(page.locator('noscript .notice')).toBeVisible();
    await expect(page.locator('[data-jam-calendar]')).toHaveCount(
      jamData.calendars.length,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  await context.close();
});

test('jam JSON and discovery publish a source-aligned current snapshot', async ({
  request,
}) => {
  const response = await request.get(`${base}/api/v1/jams.json`);
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(payload).toEqual(jamSnapshot(new Date(payload.generatedAt)));
  const manifest = await (
    await request.get(`${base}/api/v1/manifest.json`)
  ).json();
  expect(manifest.endpoints.jams).toMatch(/\/game-dev-db\/api\/v1\/jams.json$/);
  expect(manifest.counts.jams).toBe(
    currentJams(jamData.events, Date.now()).length,
  );
  expect(await (await request.get(`${base}/llms.txt`)).text()).toContain(
    manifest.endpoints.jams,
  );
  const sitemap = await (await request.get(`${base}/sitemap.xml`)).text();
  for (const lang of ['ru', 'en'])
    expect(sitemap).toContain(`${base}/${lang}/jams/`);
});
