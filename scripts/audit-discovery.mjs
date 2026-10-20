import { load } from 'cheerio';

// Only public URLs are read. No account access, submissions or credentials.
const target = new URL(
  process.argv[2] ?? 'https://polyakovin.github.io/game-dev-db/',
);
if (!['http:', 'https:'].includes(target.protocol))
  throw new Error('Expected an HTTP(S) site URL');
if (!target.pathname.endsWith('/')) target.pathname += '/';
const canonicalRoot = 'https://polyakovin.github.io/game-dev-db/';
const observations = [];
const failures = [];
const warnings = [];
const atTarget = (url) => new URL(url.replace(canonicalRoot, ''), target);
async function read(relative, contentType) {
  const url = new URL(relative, target);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    const body = await response.text();
    observations.push({
      url: url.href,
      status: response.status,
      bytes: Buffer.byteLength(body),
      contentType: response.headers.get('content-type'),
    });
    if (!response.ok) failures.push(`${url}: HTTP ${response.status}`);
    if (
      contentType &&
      !response.headers.get('content-type')?.includes(contentType)
    )
      failures.push(`${url}: expected ${contentType}`);
    if (/noindex/i.test(response.headers.get('x-robots-tag') ?? ''))
      failures.push(`${url}: X-Robots-Tag prohibits indexing`);
    return body;
  } catch (error) {
    failures.push(`${url}: ${error.message}`);
    return '';
  }
}
function parse(body, label) {
  try {
    return JSON.parse(body);
  } catch {
    failures.push(`${label}: invalid JSON`);
    return {};
  }
}
const manifest = parse(
  await read('api/v1/manifest.json', 'application/json'),
  'manifest',
);
if (manifest.schemaVersion !== 1)
  failures.push('Unsupported manifest schemaVersion');
await read('llms.txt', 'text/plain');
const sitemap = load(await read('sitemap.xml', 'xml'), { xmlMode: true });
const locations = sitemap('url > loc')
  .map((_, node) => sitemap(node).text())
  .get();
const locationSet = new Set(locations);
if (!locations.length || locationSet.size !== locations.length)
  failures.push('Empty or duplicate sitemap URLs');
if (
  locations.some(
    (url) =>
      !url.startsWith(canonicalRoot) ||
      url.includes('#') ||
      url.includes('/api/'),
  )
)
  failures.push('Sitemap contains noncanonical URLs');
for (const lang of ['ru', 'en']) {
  await read(`llms/${lang}.txt`, 'text/plain');
  const instructions = await read(
    `agent-instructions/${lang}.md`,
    'text/markdown',
  );
  if (!instructions.includes(`api/v1/knowledge/${lang}/index.json`))
    failures.push(`${lang}: instructions do not reference the language index`);
  const index = parse(
    await read(`api/v1/knowledge/${lang}/index.json`, 'application/json'),
    `${lang} index`,
  );
  const records = index.records ?? [];
  for (const entry of records.filter((r) =>
    ['lesson', 'mechanic', 'practice', 'lens', 'path', 'catalog'].includes(
      r.type,
    ),
  ))
    if (!locationSet.has(entry.url))
      failures.push(`${lang}/${entry.key}: missing from sitemap`);
  for (const type of ['lesson', 'mechanic', 'practice', 'lens']) {
    const entry = records.find((r) => r.type === type);
    if (!entry) {
      failures.push(`${lang}: no ${type} to inspect`);
      continue;
    }
    const payload = parse(
      await read(atTarget(entry.jsonUrl).href, 'application/json'),
      entry.key,
    );
    const markdown = await read(
      atTarget(entry.markdownUrl).href,
      'text/markdown',
    );
    const html = load(await read(atTarget(entry.url).href, 'text/html'));
    if (payload.record?.url !== entry.url || !markdown.includes(entry.url))
      failures.push(`${lang}/${entry.key}: inconsistent citation URL`);
    if (
      html('h1').text() !== entry.title ||
      html('link[rel="canonical"]').attr('href') !== entry.url
    )
      failures.push(`${lang}/${entry.key}: incorrect HTML identity`);
    if (/noindex/i.test(html('meta[name="robots"]').attr('content') ?? ''))
      failures.push(`${lang}/${entry.key}: noindex`);
    if (html('link[type="text/markdown"]').attr('href') !== entry.markdownUrl)
      failures.push(`${lang}/${entry.key}: missing Markdown discovery`);
    if (html('link[hreflang]').length !== 2)
      failures.push(`${lang}/${entry.key}: missing language alternates`);
  }
}
try {
  const response = await fetch(new URL('/robots.txt', target), {
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 404)
    warnings.push(
      'Host-root robots.txt is absent. This does not prohibit crawling. Submit sitemap through webmaster accounts; a project-subdirectory robots.txt is not host policy.',
    );
  else if (!response.ok)
    warnings.push(
      `Host-root robots.txt: HTTP ${response.status}; inspect crawler access.`,
    );
  else
    warnings.push(
      'Host-root robots.txt exists; inspect its rules in webmaster tools for each crawler and URL.',
    );
} catch (error) {
  warnings.push(`Host-root robots check unavailable: ${error.message}`);
}
console.log(
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      target: target.href,
      sitemapUrls: locations.length,
      observations,
      warnings,
      failures,
      indexing:
        'Not established by HTTP checks. Inspect verified webmaster accounts.',
      aiCitations: 'Not measured by this audit.',
    },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
