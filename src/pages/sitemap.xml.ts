import { getKnowledge } from '../lib/knowledge-content';
import { hasFocusedPage } from '../lib/discovery.mjs';
import { absolute, locales } from '../lib/site';

const xml = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[char]!,
  );
export async function GET() {
  const entries = new Map<string, string | null>();
  for (const lang of locales) {
    for (const route of [
      '',
      'search/',
      'resources/',
      'mechanics/',
      'practice/',
      'lenses/',
      'jams/',
      'for-agents/',
    ])
      entries.set(absolute(`${lang}/${route}`), null);
    for (const record of (await getKnowledge(lang)).records) {
      if (
        record.status !== 'active' ||
        !(
          ['lesson', 'path', 'catalog'].includes(record.type) ||
          hasFocusedPage(record)
        )
      )
        continue;
      const previous = entries.get(record.url);
      entries.set(
        record.url,
        [previous, record.updatedAt]
          .filter((date): date is string => Boolean(date))
          .sort()
          .at(-1) ?? null,
      );
    }
  }
  const urls = [...entries].map(([url, modified]) => {
    const alternates = locales.map((lang) =>
      url.replace(/\/game-dev-db\/(ru|en)\//, `/game-dev-db/${lang}/`),
    );
    return `<url><loc>${xml(url)}</loc>${modified ? `<lastmod>${xml(modified)}</lastmod>` : ''}${alternates.map((href, i) => `<xhtml:link rel="alternate" hreflang="${locales[i]}" href="${xml(href)}"/>`).join('')}</url>`;
  });
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    },
  );
}
