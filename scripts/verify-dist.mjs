import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import matter from 'gray-matter';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://polyakovin.github.io';
const base = '/game-dev-db/';
const sourceResources = JSON.parse(
  await readFile(path.join(root, 'src/data/resources.json'), 'utf8'),
);
const externalResourceUrls = new Set(
  sourceResources.map((resource) => new URL(resource.url).href),
);
const errors = [];
const documentCache = new Map();
const exports = new Map();

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
    // Other GitHub Pages projects can be explicitly listed as external resources.
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
  'api/v1/resources.json',
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
const resourceExport = exports.get('api/v1/resources.json');
for (const [name, payload] of [
  ['manifest', manifest],
  ['lessons', lessonExport],
  ['resources', resourceExport],
]) {
  if (!payload || payload.schemaVersion !== 1)
    errors.push(`${name} JSON: schemaVersion must be 1`);
  if (!payload || payload.license !== 'CC-BY-4.0' || !payload.attribution)
    errors.push(`${name} JSON: content license and attribution are required`);
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
  JSON.stringify(resourceExport?.resources) !== JSON.stringify(sourceResources)
)
  errors.push('Resources JSON differs from source resources');
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
for (const key of ['lessons', 'resources', 'discovery', 'fullText']) {
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
