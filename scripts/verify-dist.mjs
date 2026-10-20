import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import matter from 'gray-matter';
import { hasFocusedPage, recordMetadata } from '../src/lib/discovery.mjs';
import { mechanicRecords } from '../src/lib/mechanics.mjs';
import { practiceRecords } from '../src/lib/practice.mjs';
import { lensRecords } from '../src/lib/lenses.mjs';
import { jamSnapshot, getJams } from '../src/lib/jams.mjs';
import { getResources } from '../src/lib/resources.mjs';
import {
  buildKnowledge,
  knowledgeIndex,
  knowledgeMarkdown,
} from '../src/lib/knowledge.mjs';
import {
  learningPathRecords,
  learningPathData,
} from '../src/lib/learning-paths.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://polyakovin.github.io';
const base = '/game-dev-db/';
const sourceResources = JSON.parse(
  await readFile(path.join(root, 'src/data/resources.json'), 'utf8'),
);
const catalogRecords = mechanicRecords();
const externalResourceUrls = new Set(
  [
    ...sourceResources.map((resource) => resource.url),
    ...catalogRecords.flatMap((catalog) => [
      ...catalog.sources.map((source) => source.url),
      ...catalog.families.flatMap((family) =>
        family.references.map((reference) => reference.url),
      ),
    ]),
  ].map((url) => new URL(url).href),
);
const errors = [];
const documentCache = new Map();
const exports = new Map();
const sitemap = load(await readFile(path.join(dist, 'sitemap.xml'), 'utf8'), {
  xmlMode: true,
});
const sitemapUrls = sitemap('url > loc')
  .map((_, node) => sitemap(node).text())
  .get();
const sitemapSet = new Set(sitemapUrls);
if (sitemapUrls.length !== sitemapSet.size)
  errors.push('Sitemap contains duplicate URLs');
for (const url of sitemapUrls) {
  if (
    url.includes('#') ||
    url.includes('/api/') ||
    url.includes('children-education')
  )
    errors.push(`Sitemap contains noncanonical URL: ${url}`);
  await checkReference(url, new URL(base, site), 'sitemap');
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? filesIn(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    ),
  );
  return nested.flat();
}

async function resolveFile(pathname) {
  if (!pathname.startsWith(base)) return null;
  const relative = decodeURIComponent(pathname.slice(base.length));
  const absolute = path.resolve(dist, relative);
  if (absolute !== dist && !absolute.startsWith(`${dist}${path.sep}`))
    return null;
  try {
    const info = await stat(absolute);
    if (info.isFile()) return absolute;
    if (info.isDirectory()) {
      const index = path.join(absolute, 'index.html');
      if ((await stat(index)).isFile()) return index;
    }
  } catch {
    return null;
  }
  return null;
}

async function document(file) {
  if (!documentCache.has(file))
    documentCache.set(file, load(await readFile(file, 'utf8')));
  return documentCache.get(file);
}

async function checkReference(reference, from, location, checkAnchor = true) {
  if (!reference || /^(?:data:|mailto:|tel:)/i.test(reference)) return;
  let url;
  try {
    url = new URL(reference, from);
  } catch {
    errors.push(`${location}: malformed URL ${reference}`);
    return;
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    errors.push(`${location}: unsupported URL protocol in ${reference}`);
    return;
  }
  if (url.origin !== site) return;
  if (!url.pathname.startsWith(base)) {
    // Other Pages projects must be explicitly attributed resources or mechanic sources.
    if (/^https?:\/\//i.test(reference) && externalResourceUrls.has(url.href))
      return;
    errors.push(
      `${location}: local URL escapes GitHub Pages base: ${reference}`,
    );
    return;
  }
  let target;
  try {
    target = await resolveFile(url.pathname);
  } catch {
    errors.push(`${location}: malformed URL path ${reference}`);
    return;
  }
  if (!target) {
    errors.push(`${location}: missing target ${reference}`);
    return;
  }
  if (checkAnchor && url.hash && url.hash !== '#' && target.endsWith('.html')) {
    let id;
    try {
      id = decodeURIComponent(url.hash.slice(1));
    } catch {
      errors.push(`${location}: malformed anchor ${reference}`);
      return;
    }
    const $ = await document(target);
    const exists = $('[id], a[name]')
      .toArray()
      .some(
        (element) =>
          $(element).attr('id') === id || $(element).attr('name') === id,
      );
    if (!exists) errors.push(`${location}: missing anchor ${reference}`);
  }
}

let files;
try {
  files = await filesIn(dist);
} catch {
  console.error(
    'Build output is missing. Run npm run build before npm run check:dist.',
  );
  process.exit(1);
}
const htmlFiles = files.filter((file) => file.endsWith('.html'));
if (!htmlFiles.length) errors.push('Build output contains no HTML pages');
for (const file of htmlFiles) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const route = relative.replace(/index\.html$/, '');
  const from = new URL(`${base}${route}`, site);
  const $ = await document(file);
  for (const element of $('[href], [src]').toArray()) {
    for (const attribute of ['href', 'src']) {
      const value = $(element).attr(attribute);
      if (value !== undefined) await checkReference(value, from, relative);
    }
  }
  if (!['ru', 'en'].includes($('html').attr('lang')))
    errors.push(`${relative}: html lang must be ru or en`);
  if (!$('title').text().trim())
    errors.push(`${relative}: page title is missing`);
}

for (const required of [
  'index.html',
  'ru/index.html',
  'en/index.html',
  'llms.txt',
  'llms-full.txt',
  'api/v1/manifest.json',
  'api/v1/lessons.json',
  'api/v1/learning-paths.json',
  'api/v1/resources.json',
  'api/v1/mechanics.json',
  'api/v1/practice.json',
  'api/v1/lenses.json',
  'api/v1/jams.json',
  'ru/jams/index.html',
  'en/jams/index.html',
  'ru/practice/index.html',
  'en/practice/index.html',
]) {
  const file = await resolveFile(`${base}${required}`);
  if (!file) {
    errors.push(`Required export is missing: ${required}`);
    continue;
  }
  const body = await readFile(file, 'utf8');
  exports.set(required, body);
  if (!body.trim()) errors.push(`Required export is empty: ${required}`);
  if (required.endsWith('.json')) {
    try {
      exports.set(required, JSON.parse(body));
    } catch {
      errors.push(`Required export is not valid JSON: ${required}`);
    }
  }
  if (required.endsWith('.txt')) {
    for (const match of body.matchAll(/\]\(([^\s)]+)\)/g))
      await checkReference(
        match[1],
        new URL(`${base}${required}`, site),
        required,
        false,
      );
  }
}

const sourceLessons = [];
for (const lang of ['ru', 'en']) {
  const sourceDirectory = path.join(root, 'src/content/lessons', lang);
  for (const filename of (await readdir(sourceDirectory)).filter((entry) =>
    entry.endsWith('.md'),
  )) {
    const source = await readFile(path.join(sourceDirectory, filename), 'utf8');
    const { data, content } = matter(source);
    sourceLessons.push({ data, content });
    const rawPath = `content/${lang}/${data.id}.md`;
    const rawFile = await resolveFile(`${base}${rawPath}`);
    if (!rawFile) errors.push(`Raw Markdown export is missing: ${rawPath}`);
    else {
      try {
        const raw = matter(await readFile(rawFile, 'utf8'));
        for (const field of Object.keys(data)) {
          if (JSON.stringify(raw.data[field]) !== JSON.stringify(data[field]))
            errors.push(
              `Raw Markdown ${rawPath}: ${field} differs from source metadata`,
            );
        }
        if (raw.content.trim() !== content.trim())
          errors.push(`Raw Markdown ${rawPath}: body differs from source`);
        if (
          raw.data.license !== 'CC-BY-4.0' ||
          raw.data.codeLicense !== 'MIT' ||
          !raw.data.attribution
        )
          errors.push(
            `Raw Markdown ${rawPath}: license, codeLicense, and attribution are required`,
          );
        if (
          raw.data.url !== `${site}${base}${lang}/lessons/${data.id}/` ||
          raw.data.markdownUrl !== `${site}${base}${rawPath}`
        )
          errors.push(
            `Raw Markdown ${rawPath}: canonical URLs are missing or incorrect`,
          );
      } catch (error) {
        errors.push(
          `Raw Markdown ${rawPath}: invalid frontmatter (${error.message})`,
        );
      }
    }
    const article = `${lang}/lessons/${data.id}/`;
    if (!(await resolveFile(`${base}${article}`)))
      errors.push(`Translated lesson page is missing: ${article}`);
  }
}

const manifest = exports.get('api/v1/manifest.json');
const lessonExport = exports.get('api/v1/lessons.json');
const pathExport = exports.get('api/v1/learning-paths.json');
const resourceExport = exports.get('api/v1/resources.json');
const mechanicExport = exports.get('api/v1/mechanics.json');
const practiceExport = exports.get('api/v1/practice.json');
for (const [name, payload] of [
  ['manifest', manifest],
  ['lessons', lessonExport],
  ['learning-paths', pathExport],
  ['resources', resourceExport],
  ['mechanics', mechanicExport],
  ['practice', practiceExport],
]) {
  if (!payload || payload.schemaVersion !== 1)
    errors.push(`${name} JSON: schemaVersion must be 1`);
  if (!payload || payload.license !== 'CC-BY-4.0' || !payload.attribution)
    errors.push(`${name} JSON: content license and attribution are required`);
}
if (JSON.stringify(pathExport?.paths) !== JSON.stringify(learningPathRecords()))
  errors.push('Learning paths JSON differs from the shared source records');
if (
  manifest?.counts?.learningPaths !== learningPathData.length ||
  manifest?.endpoints?.learningPaths !==
    `${site}${base}api/v1/learning-paths.json`
)
  errors.push('Manifest: learning path count or endpoint is incorrect');
for (const route of learningPathRecords()) {
  const file = await resolveFile(new URL(route.url).pathname);
  if (!file) {
    errors.push(`Learning path page missing: ${route.lang}/${route.id}`);
    continue;
  }
  const $ = await document(file);
  if ($('h1').text() !== route.title)
    errors.push(`Learning path ${route.id}: title differs from source`);
  for (const [selector, items] of [
    ['[data-path-lesson]', route.lessons],
    ['[data-path-practice]', route.practice],
    ['[data-path-lens]', route.lenses],
  ]) {
    const hrefs = $(selector)
      .toArray()
      .map((node) => $(node).attr('href'));
    const expected = items.map(
      (item) => new URL(item.url).pathname + new URL(item.url).hash,
    );
    if (JSON.stringify(hrefs) !== JSON.stringify(expected))
      errors.push(
        `Learning path ${route.lang}/${route.id}: ${selector} order or links differ`,
      );
  }
}
if (!Array.isArray(lessonExport?.lessons)) {
  errors.push('Lessons JSON must contain a lessons array');
} else {
  const exportedLessons = new Map();
  for (const lesson of lessonExport.lessons) {
    const key = `${lesson?.lang}/${lesson?.id}`;
    if (exportedLessons.has(key))
      errors.push(`Lessons JSON contains a duplicate identity: ${key}`);
    exportedLessons.set(key, lesson);
  }
  if (lessonExport.lessons.length !== sourceLessons.length)
    errors.push('Lessons JSON count differs from source content');
  for (const { data, content } of sourceLessons) {
    const key = `${data.lang}/${data.id}`;
    const lesson = exportedLessons.get(key);
    if (!lesson) {
      errors.push(`Lessons JSON is missing ${key}`);
      continue;
    }
    for (const field of Object.keys(data)) {
      if (JSON.stringify(lesson[field]) !== JSON.stringify(data[field]))
        errors.push(
          `Lessons JSON ${key}: ${field} differs from source metadata`,
        );
    }
    if (
      typeof lesson.body !== 'string' ||
      lesson.body.trim() !== content.trim()
    )
      errors.push(`Lessons JSON ${key}: Markdown body differs from source`);
    if (
      lesson.license !== 'CC-BY-4.0' ||
      lesson.codeLicense !== 'MIT' ||
      !lesson.attribution
    )
      errors.push(
        `Lessons JSON ${key}: license, codeLicense, and attribution are required`,
      );
    for (const field of ['url', 'markdownUrl']) {
      if (
        typeof lesson[field] !== 'string' ||
        !lesson[field].startsWith(`${site}${base}`)
      )
        errors.push(
          `Lessons JSON ${key}: ${field} must be an absolute site URL`,
        );
      else
        await checkReference(
          lesson[field],
          new URL(base, site),
          `Lessons JSON ${key}`,
          false,
        );
    }
    if (!exports.get('llms-full.txt')?.includes(content.trim()))
      errors.push(`Full corpus is missing the body of ${key}`);
  }
}
if (
  JSON.stringify(resourceExport?.resources) !== JSON.stringify(getResources())
)
  errors.push(
    'Resources JSON differs from editorially ordered source resources',
  );
if (
  manifest?.counts?.lessons !== sourceLessons.length ||
  manifest?.counts?.translationPairs !== sourceLessons.length / 2 ||
  manifest?.counts?.resources !== sourceResources.length
) {
  errors.push('Manifest counts differ from source content');
}
if (
  !Array.isArray(manifest?.languages) ||
  JSON.stringify([...manifest.languages].sort()) !==
    JSON.stringify(['en', 'ru'])
)
  errors.push('Manifest languages must be en and ru');
for (const key of [
  'lessons',
  'resources',
  'mechanics',
  'practice',
  'lenses',
  'jams',
  'discovery',
  'fullText',
]) {
  const endpoint = manifest?.endpoints?.[key];
  if (typeof endpoint !== 'string' || !endpoint.startsWith(`${site}${base}`))
    errors.push(`Manifest endpoint ${key} must be an absolute site URL`);
  else
    await checkReference(
      endpoint,
      new URL(base, site),
      `Manifest endpoint ${key}`,
      false,
    );
}

if (JSON.stringify(mechanicExport?.catalogs) !== JSON.stringify(catalogRecords))
  errors.push('Mechanics JSON differs from complete localized source records');
if (
  manifest?.counts?.mechanics !== catalogRecords.length ||
  manifest?.counts?.mechanicsTranslationPairs !== catalogRecords.length / 2
)
  errors.push('Manifest mechanic counts differ from source content');
for (const catalog of catalogRecords) {
  const key = `${catalog.lang}/${catalog.id}`;
  const htmlFile = await resolveFile(new URL(catalog.url).pathname);
  const mdFile = await resolveFile(new URL(catalog.markdownUrl).pathname);
  if (!htmlFile || !mdFile) {
    errors.push(`Missing mechanic page or Markdown: ${key}`);
    continue;
  }
  const raw = matter(await readFile(mdFile, 'utf8'));
  const { families, sections, notes, body, ...metadata } = catalog;
  if (
    raw.content.trim() !== body.trim() ||
    JSON.stringify(raw.data) !== JSON.stringify(metadata)
  )
    errors.push(`Mechanics Markdown differs from source: ${key}`);
  const $ = await document(htmlFile);
  if (
    $('[data-family]').length !== catalog.counts.families ||
    $('[data-variant]').length !== catalog.counts.variants
  )
    errors.push(`Mechanics HTML count differs from source: ${key}`);
  for (const family of families) {
    if ($(`#${family.id} [data-family-title]`).text() !== family.title)
      errors.push(`Mechanics HTML family differs: ${key}/${family.id}`);
    const references = $(`#${family.id} [data-reference]`)
      .toArray()
      .map((a) => ({ title: $(a).text(), url: $(a).attr('href') }));
    if (JSON.stringify(references) !== JSON.stringify(family.references))
      errors.push(`Mechanics HTML references differ: ${key}/${family.id}`);
    for (const branch of family.branches)
      for (const variant of branch.variants) {
        if ($(`#${variant.id}`).text() !== variant.text)
          errors.push(`Mechanics HTML variant differs: ${key}/${variant.id}`);
      }
  }
  for (const note of notes)
    for (const entry of note.entries) {
      if ($(`#${entry.id} p`).text() !== entry.text)
        errors.push(`Mechanics HTML design note differs: ${key}/${entry.id}`);
    }
  for (const source of catalog.sources) {
    if (
      !$('main a[href]')
        .toArray()
        .some((a) => $(a).attr('href') === source.url)
    )
      errors.push(`Mechanics HTML source missing: ${key}/${source.url}`);
  }
  if (!exports.get('llms-full.txt')?.includes(body.trim()))
    errors.push(`Full corpus missing mechanic catalog: ${key}`);
  if (!exports.get('llms.txt')?.includes(catalog.markdownUrl))
    errors.push(`Discovery missing mechanic catalog: ${key}`);
}

const practiceCatalogs = practiceRecords();
if (
  JSON.stringify(practiceExport?.catalogs) !== JSON.stringify(practiceCatalogs)
)
  errors.push('Practice JSON differs from complete localized source records');
if (
  manifest?.counts?.practiceCatalogs !== practiceCatalogs.length ||
  manifest?.counts?.practiceTasks !== practiceCatalogs[0].counts.tasks ||
  manifest?.counts?.practiceTranslationPairs !==
    practiceCatalogs[0].counts.tasks
)
  errors.push('Manifest practice counts differ from source content');
for (const catalog of practiceCatalogs) {
  const key = `${catalog.lang}/${catalog.id}`;
  const htmlFile = await resolveFile(new URL(catalog.url).pathname);
  const mdFile = await resolveFile(new URL(catalog.markdownUrl).pathname);
  if (!htmlFile || !mdFile) {
    errors.push(`Missing practice HTML or Markdown: ${key}`);
    continue;
  }
  const raw = matter(await readFile(mdFile, 'utf8'));
  const { tasks, topics, body, ...metadata } = catalog;
  if (
    raw.content.trim() !== body.trim() ||
    JSON.stringify(raw.data) !== JSON.stringify(metadata)
  )
    errors.push(`Practice Markdown differs from source: ${key}`);
  const $ = await document(htmlFile);
  if ($('[data-exercise]').length !== tasks.length)
    errors.push(`Practice HTML count differs from source: ${key}`);
  for (const task of tasks) {
    for (const field of [
      'title',
      'goal',
      'brief',
      'format',
      'deliverable',
      'reflection',
    ])
      if ($(`#${task.id} [data-exercise-${field}]`).text() !== task[field])
        errors.push(`Practice HTML text differs: ${key}/${task.id}/${field}`);
    for (const field of ['constraints', 'steps', 'checks'])
      if (
        JSON.stringify(
          $(`#${task.id} [data-exercise-${field}] li`)
            .toArray()
            .map((item) => $(item).text()),
        ) !== JSON.stringify(task[field])
      )
        errors.push(`Practice HTML list differs: ${key}/${task.id}/${field}`);
    await checkReference(
      task.url,
      new URL(base, site),
      `Practice exercise ${key}/${task.id}`,
    );
  }
  for (const item of catalog.sources)
    if (
      !$('main a[href]')
        .toArray()
        .some((a) => $(a).attr('href') === item.url)
    )
      errors.push(`Practice source link missing: ${key}/${item.url}`);
  if (!exports.get('llms-full.txt')?.includes(body.trim()))
    errors.push(`Full corpus missing practice: ${key}`);
  if (!exports.get('llms.txt')?.includes(catalog.markdownUrl))
    errors.push(`Discovery missing practice: ${key}`);
}

const lensesExport = exports.get('api/v1/lenses.json');
const lensCatalogs = lensRecords();
if (
  lensesExport?.schemaVersion !== 1 ||
  lensesExport?.license !== 'CC-BY-4.0' ||
  !lensesExport?.attribution ||
  JSON.stringify(lensesExport?.catalogs) !== JSON.stringify(lensCatalogs)
)
  errors.push(
    'Lenses JSON differs from localized source records or lacks export metadata',
  );
if (
  manifest?.counts?.lensCatalogs !== lensCatalogs.length ||
  manifest?.counts?.lensPerspectives !== lensCatalogs[0].counts.total
)
  errors.push('Manifest lens counts differ from source');
for (const catalog of lensCatalogs) {
  const key = `${catalog.lang}/${catalog.id}`;
  const htmlFile = await resolveFile(new URL(catalog.url).pathname);
  const mdFile = await resolveFile(new URL(catalog.markdownUrl).pathname);
  if (!htmlFile || !mdFile) {
    errors.push(`Missing lens page or Markdown: ${key}`);
    continue;
  }
  const raw = matter(await readFile(mdFile, 'utf8'));
  const { themes, lenses, body, ...metadata } = catalog;
  if (
    raw.content.trim() !== body.trim() ||
    JSON.stringify(raw.data) !== JSON.stringify(metadata)
  )
    errors.push(`Lenses Markdown differs from source: ${key}`);
  const $ = await document(htmlFile);
  if ($('[data-lens]').length !== lenses.length)
    errors.push(`Lens HTML count differs: ${key}`);
  for (const lens of lenses) {
    const node = $(`#${lens.id}`);
    if (
      node.find('[data-lens-title]').text() !== lens.title ||
      node.find('[data-lens-description]').text() !== lens.description ||
      JSON.stringify(
        node
          .find('[data-lens-question]')
          .toArray()
          .map((q) => $(q).text()),
      ) !== JSON.stringify(lens.questions)
    )
      errors.push(`Lens HTML content differs: ${key}/${lens.id}`);
    if (
      !node
        .find('a[href]')
        .toArray()
        .some((a) => $(a).attr('href') === lens.referenceUrl)
    )
      errors.push(`Lens reference missing: ${key}/${lens.id}`);
  }
  if (
    !exports.get('llms-full.txt')?.includes(body.trim()) ||
    !exports.get('llms.txt')?.includes(catalog.markdownUrl)
  )
    errors.push(`Lens agent discovery or corpus missing: ${key}`);
}

const jamExport = exports.get('api/v1/jams.json');
if (!jamExport || !Number.isFinite(Date.parse(jamExport.generatedAt))) {
  errors.push('Jams JSON is missing a valid generation timestamp');
} else {
  const generated = new Date(jamExport.generatedAt);
  if (JSON.stringify(jamExport) !== JSON.stringify(jamSnapshot(generated)))
    errors.push('Jams JSON differs from the current bilingual source snapshot');
  if (
    manifest?.counts?.jams !== jamExport.events.length ||
    manifest?.counts?.jamCalendars !== jamExport.calendars.length
  )
    errors.push('Manifest jam counts differ from the exported snapshot');
  if (!exports.get('llms.txt')?.includes('/api/v1/jams.json'))
    errors.push('Jam export is missing from agent discovery');
  for (const lang of ['ru', 'en']) {
    const file = await resolveFile(`${base}${lang}/jams/`);
    if (!file) continue;
    const $ = await document(file);
    const snapshotAt = $('[data-jam-generated-at]').attr('datetime');
    if (!snapshotAt || !Number.isFinite(Date.parse(snapshotAt))) {
      errors.push(`Jams ${lang}: build timestamp missing`);
      continue;
    }
    const catalog = getJams(lang, new Date(snapshotAt));
    if (
      $('[data-jam]').length !== catalog.events.length ||
      $('[data-jam-count]').text() !== String(catalog.events.length)
    )
      errors.push(`Jams ${lang}: HTML count differs from its source snapshot`);
    for (const event of catalog.events) {
      const card = $(`[data-jam-id="${event.id}"]`);
      if (
        card.find('h3').text() !== event.title ||
        card.find('.jam-requirements').text() !== event.requirements ||
        card.find('.jam-entry').attr('href') !== event.url ||
        card.attr('data-ends-at') !== event.endsAt
      )
        errors.push(
          `Jams ${lang}/${event.id}: content or deadline differs from source`,
        );
    }
    if ($('[data-jam-calendar]').length !== catalog.calendars.length)
      errors.push(`Jams ${lang}: missing discovery calendars`);
    for (const calendar of catalog.calendars)
      if (
        $(`[data-jam-calendar="${calendar.id}"]`).attr('href') !== calendar.url
      )
        errors.push(`Jams ${lang}: incorrect calendar link ${calendar.id}`);
  }
}

for (const lang of ['ru', 'en']) {
  const dataset = buildKnowledge(
    sourceLessons
      .filter((lesson) => lesson.data.lang === lang)
      .map(({ data, content }) => ({ ...data, body: content })),
    lang,
  );
  for (const [filename, search] of [
    ['index.json', false],
    ['search.json', true],
  ]) {
    const actual = JSON.parse(
      await readFile(
        path.join(dist, `api/v1/knowledge/${lang}/${filename}`),
        'utf8',
      ),
    );
    if (
      JSON.stringify(actual) !==
      JSON.stringify(knowledgeIndex(dataset, { search }))
    )
      errors.push(`Knowledge ${lang}/${filename} differs from source`);
  }
  for (const record of dataset.records) {
    const jsonFile = await resolveFile(new URL(record.jsonUrl).pathname);
    const markdownFile = await resolveFile(
      new URL(record.markdownUrl).pathname,
    );
    if (!jsonFile || !markdownFile) {
      errors.push(`Knowledge record missing: ${record.key}/${lang}`);
      continue;
    }
    const actual = JSON.parse(await readFile(jsonFile, 'utf8'));
    if (JSON.stringify(actual.record) !== JSON.stringify(record))
      errors.push(`Knowledge JSON differs: ${record.key}/${lang}`);
    const markdown = matter(await readFile(markdownFile, 'utf8'));
    if (
      markdown.content.trim() !== knowledgeMarkdown(record).trim() ||
      markdown.data.key !== record.key ||
      JSON.stringify(markdown.data.sourceIds) !==
        JSON.stringify(record.sourceIds)
    )
      errors.push(`Knowledge Markdown differs: ${record.key}/${lang}`);
    if (hasFocusedPage(record) || record.type === 'lesson') {
      const htmlFile = await resolveFile(new URL(record.url).pathname);
      if (!htmlFile) {
        errors.push(`Focused page missing: ${record.key}/${lang}`);
        continue;
      }
      const $ = await document(htmlFile);
      if (
        $('h1').text() !== record.title ||
        $('link[rel="canonical"]').attr('href') !== record.url
      )
        errors.push(`Focused page identity differs: ${record.key}/${lang}`);
      if (
        $('link[type="text/markdown"]').attr('href') !== record.markdownUrl ||
        $('link[title="Knowledge record"]').attr('href') !== record.jsonUrl
      )
        errors.push(
          `Focused page format discovery differs: ${record.key}/${lang}`,
        );
      try {
        if (
          JSON.stringify(
            JSON.parse($('script[type="application/ld+json"]').text()),
          ) !== JSON.stringify(recordMetadata(record))
        )
          errors.push(`Focused page metadata differs: ${record.key}/${lang}`);
      } catch {
        errors.push(`Invalid structured metadata: ${record.key}/${lang}`);
      }
      if (!sitemapSet.has(record.url))
        errors.push(`Sitemap missing focused page: ${record.key}/${lang}`);
      if (hasFocusedPage(record)) {
        const actualSections = $('[data-record-section]')
          .map((_, node) => $(node).attr('id'))
          .get();
        if (
          JSON.stringify(actualSections) !==
          JSON.stringify(record.sections.map((s) => s.id))
        )
          errors.push(`Focused page sections differ: ${record.key}/${lang}`);
        for (const source of record.sources)
          if (
            !$('#sources a')
              .toArray()
              .some((node) => $(node).attr('href') === source.url)
          )
            errors.push(`Focused page source missing: ${record.key}/${lang}`);
      }
    }
    await checkReference(
      record.url,
      new URL(base, site),
      `Knowledge ${record.key}/${lang}`,
      false,
    );
    for (const relation of record.relations)
      await checkReference(
        relation.url,
        new URL(base, site),
        `Knowledge relation ${record.key}/${lang}`,
        false,
      );
  }
}

if (errors.length) {
  console.error(
    `Build validation failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Build verified: ${htmlFiles.length} HTML pages, local links and anchors, bilingual routes, JSON and Markdown exports.`,
  );
}
