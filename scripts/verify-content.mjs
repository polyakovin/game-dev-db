import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { validateMechanics, mechanicCatalogs } from '../src/lib/mechanics.mjs';
import { validateDirectionMaterials } from '../src/lib/mechanic-directions.mjs';
import { validateMechanicOverviews } from '../src/lib/mechanic-overview-validation.mjs';
import { validatePractice, practiceSource } from '../src/lib/practice.mjs';
import { validateLenses, lensData } from '../src/lib/lenses.mjs';
import { validateJams, jamData } from '../src/lib/jams.mjs';
import { validateContentOrder } from '../src/lib/content-order.mjs';
import { resourceGroups } from '../src/lib/resources.mjs';
import { validateLearningPaths } from '../src/lib/learning-paths.mjs';
import { buildKnowledge, validateKnowledge } from '../src/lib/knowledge.mjs';

const root = path.resolve(import.meta.dirname, '..');
const languages = ['ru', 'en'];
const categories = ['foundations', 'design', 'engineering', 'workflow'];
const errors = [];
const lessons = new Map();
const check = (condition, location, message) => {
  if (!condition) errors.push(`${location}: ${message}`);
};
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const slug = (value) =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const https = (value) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

for (const lang of languages) {
  const directory = path.join(root, 'src/content/lessons', lang);
  let files;
  try {
    files = (await readdir(directory))
      .filter((file) => file.endsWith('.md'))
      .sort();
  } catch {
    errors.push(`Missing lesson directory: src/content/lessons/${lang}`);
    continue;
  }
  check(files.length > 0, directory, 'at least one lesson is required');
  for (const file of files) {
    const location = `src/content/lessons/${lang}/${file}`;
    let parsed;
    try {
      parsed = matter(await readFile(path.join(directory, file), 'utf8'));
    } catch (error) {
      errors.push(`${location}: invalid frontmatter (${error.message})`);
      continue;
    }
    const { data, content } = parsed;
    check(slug(data.id), location, 'id must be a lowercase hyphenated slug');
    check(
      data.id === file.slice(0, -3),
      location,
      'id must match the Markdown filename',
    );
    check(
      data.lang === lang,
      location,
      'lang must match the language directory',
    );
    for (const field of ['title', 'description']) {
      check(text(data[field]), location, `${field} must be a nonempty string`);
    }
    check(
      categories.includes(data.category),
      location,
      `category must be one of ${categories.join(', ')}`,
    );
    check(
      ['beginner', 'intermediate'].includes(data.level),
      location,
      'level must be beginner or intermediate',
    );
    check(
      Number.isInteger(data.minutes) && data.minutes > 0 && data.minutes <= 120,
      location,
      'minutes must be an integer from 1 to 120',
    );
    const validDate =
      typeof data.updatedAt === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt) &&
      !Number.isNaN(Date.parse(`${data.updatedAt}T00:00:00Z`)) &&
      new Date(`${data.updatedAt}T00:00:00Z`).toISOString().slice(0, 10) ===
        data.updatedAt;
    check(
      validDate,
      location,
      'updatedAt must be a valid, quoted YYYY-MM-DD date',
    );
    check(
      Array.isArray(data.tags) && data.tags.length > 0 && data.tags.every(text),
      location,
      'tags must be a nonempty list of strings',
    );
    if (Array.isArray(data.tags))
      check(
        new Set(data.tags).size === data.tags.length,
        location,
        'tags must be unique',
      );
    check(
      Array.isArray(data.sources) && data.sources.length > 0,
      location,
      'at least one source is required',
    );
    if (Array.isArray(data.sources)) {
      const urls = new Set();
      for (const [index, source] of data.sources.entries()) {
        check(
          source && text(source.title) && https(source.url),
          location,
          `source ${index + 1} needs a title and an HTTPS URL`,
        );
        if (source?.url) {
          check(
            !urls.has(source.url),
            location,
            `duplicate source URL: ${source.url}`,
          );
          urls.add(source.url);
        }
      }
    }
    const expectedHeadings =
      lang === 'ru'
        ? [
            'Что нужно знать',
            'Принцип',
            'Практический пример',
            'Частые ошибки',
            'Проверка результата',
            'Задание для ИИ-агента',
          ]
        : [
            'Prerequisites',
            'The principle',
            'Practical example',
            'Common mistakes',
            'Verify it',
            'Prompt for an AI agent',
          ];
    check(
      JSON.stringify([...content.matchAll(/^## (.+)$/gm)].map((m) => m[1])) ===
        JSON.stringify(expectedHeadings),
      location,
      'lesson must use the six canonical sections in order',
    );
    const words = content.trim().split(/\s+/u).filter(Boolean).length;
    check(
      words >= 120,
      location,
      `body must contain at least 120 words (found ${words})`,
    );
    check(
      (content.match(/^##\s+\S/gm) ?? []).length >= 3,
      location,
      'body must contain at least three second-level sections',
    );
    const key = `${lang}/${data.id}`;
    check(!lessons.has(key), location, `duplicate lesson identity: ${key}`);
    lessons.set(key, { data, location, body: content });
  }
}

for (const { data, location } of lessons.values()) {
  const counterpart = lessons.get(
    `${data.lang === 'ru' ? 'en' : 'ru'}/${data.id}`,
  );
  check(
    Boolean(counterpart),
    location,
    'a matching RU/EN translation is required',
  );
  if (counterpart) {
    for (const field of ['category', 'level', 'updatedAt', 'minutes']) {
      check(
        data[field] === counterpart.data[field],
        location,
        `${field} must match its translation`,
      );
    }
    check(
      JSON.stringify(data.sources?.map((s) => s.url).sort()) ===
        JSON.stringify(counterpart.data.sources?.map((s) => s.url).sort()),
      location,
      'source URLs must match their translation',
    );
  }
}

for (const lang of languages) {
  try {
    const dataset = buildKnowledge(
      [...lessons.values()]
        .filter((l) => l.data.lang === lang)
        .map((l) => ({ ...l.data, body: l.body })),
      lang,
    );
    errors.push(...validateKnowledge(dataset));
  } catch (error) {
    errors.push(`knowledge/${lang}: ${error.message}`);
  }
}

const resourcePath = 'src/data/resources.json';
let resources = [];
try {
  resources = JSON.parse(await readFile(path.join(root, resourcePath), 'utf8'));
  if (!Array.isArray(resources)) throw new Error('root must be an array');
} catch (error) {
  errors.push(`${resourcePath}: ${error.message}`);
  resources = [];
}
check(resources.length > 0, resourcePath, 'at least one resource is required');
const resourceIds = new Set();
const resourceUrls = new Set();
for (const [index, resource] of resources.entries()) {
  const location = `${resourcePath}[${index}]`;
  if (!resource || typeof resource !== 'object') {
    errors.push(`${location}: resource must be an object`);
    continue;
  }
  check(slug(resource.id), location, 'id must be a lowercase hyphenated slug');
  check(
    !resourceIds.has(resource.id),
    location,
    `duplicate resource id: ${resource.id}`,
  );
  resourceIds.add(resource.id);
  check(https(resource.url), location, 'url must use HTTPS');
  const normalizedUrl =
    typeof resource.url === 'string'
      ? resource.url.replace(/\/$/, '')
      : resource.url;
  check(
    !resourceUrls.has(normalizedUrl),
    location,
    `duplicate resource URL: ${resource.url}`,
  );
  resourceUrls.add(normalizedUrl);
  check(
    categories.includes(resource.category),
    location,
    'category must use the lesson taxonomy',
  );
  check(
    ['en', 'ru', 'multi'].includes(resource.language),
    location,
    'language must be en, ru, or multi',
  );
  check(
    ['documentation', 'book', 'article', 'tool'].includes(resource.kind),
    location,
    'invalid resource kind',
  );
  if (resource.format !== undefined) {
    check(
      ['channel', 'game', 'course'].includes(resource.format),
      location,
      'format must be channel, game, or course',
    );
    check(
      resource.format === 'game'
        ? resource.kind === 'tool'
        : resource.kind === 'documentation',
      location,
      'game format requires tool kind; channel/course require documentation',
    );
  }
  for (const field of ['authors', 'access', 'practice']) {
    if (resource[field] !== undefined) {
      for (const lang of languages) {
        check(
          text(resource[field]?.[lang]),
          location,
          `${field}.${lang} must be a nonempty string`,
        );
      }
    }
  }
  for (const field of ['title', 'description']) {
    for (const lang of languages) {
      check(
        text(resource[field]?.[lang]),
        location,
        `${field}.${lang} must be a nonempty string`,
      );
    }
  }
}

errors.push(...validateMechanics());
errors.push(...validateDirectionMaterials(), ...validateMechanicOverviews());
errors.push(...validatePractice(), ...validateLenses(), ...validateJams());
errors.push(
  ...validateLearningPaths({
    lessons: [...lessons.keys()],
    practice: practiceSource.tasks.map((t) => t.id),
    lenses: lensData.lenses.map((l) => l.id),
  }),
);

const ids = (items) => items.map((item) => item.id);
const orderingScopes = {
  'lesson-categories': categories,
  lessons: [...new Set([...lessons.values()].map((lesson) => lesson.data.id))],
  mechanics: ids(mechanicCatalogs),
  'resource-groups': ids(resourceGroups),
  resources: ids(resources),
  'practice-topics': ids(practiceSource.topics),
  'practice-tasks': ids(practiceSource.tasks),
  'lens-themes': ids(lensData.themes),
  'jam-calendars': ids(jamData.calendars),
};
for (const theme of lensData.themes)
  orderingScopes[`lenses/${theme.id}`] = ids(
    lensData.lenses.filter((lens) => lens.theme === theme.id),
  );
for (const catalog of mechanicCatalogs) {
  const scope = `mechanics/${catalog.id}`;
  orderingScopes[`${scope}/sections`] = ids(catalog.sections);
  orderingScopes[`${scope}/notes`] = ids(catalog.notes);
  for (const section of catalog.sections)
    orderingScopes[`${scope}/${section.id}/families`] = ids(
      catalog.families.filter((family) => family.section === section.id),
    );
  for (const family of catalog.families) {
    orderingScopes[`${scope}/${family.id}/branches`] = ids(family.branches);
    for (const branch of family.branches)
      orderingScopes[`${scope}/${branch.id}/variants`] = ids(branch.variants);
  }
  for (const note of catalog.notes)
    orderingScopes[`${scope}/${note.id}/entries`] = ids(note.entries);
}
errors.push(...validateContentOrder(orderingScopes));

if (errors.length) {
  console.error(
    `Content validation failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Content verified: ${lessons.size} localized lessons (${lessons.size / 2} translation pairs), ${resources.length} resources, ${mechanicCatalogs.length} bilingual mechanic catalogs, ${practiceSource.tasks.length} bilingual exercises, ${lensData.lenses.length} bilingual lenses.`,
  );
}
