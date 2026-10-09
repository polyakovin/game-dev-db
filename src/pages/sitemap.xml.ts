import { getLessons } from '../lib/content';
import { absolute, locales } from '../lib/site';
import { mechanicRecords } from '../lib/mechanics.mjs';
export async function GET() {
  const urls = [
    ...locales.flatMap((lang) => [
      absolute(`${lang}/`),
      absolute(`${lang}/resources/`),
      absolute(`${lang}/mechanics/`),
      absolute(`${lang}/practice/`),
      absolute(`${lang}/for-agents/`),
    ]),
    ...(await getLessons()).map(({ data }) =>
      absolute(`${data.lang}/lessons/${data.id}/`),
    ),
    ...mechanicRecords().map((c) => c.url),
  ];
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls.map((url) => `<url><loc>${url}</loc></url>`).join('') +
      '</urlset>',
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
