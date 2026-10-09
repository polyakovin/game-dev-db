import data from '../data/lenses.json' with { type: 'json' };
import { absolute } from './site.ts';

export const lensData = data;

/** @param {'ru' | 'en'} lang */
export function getLenses(lang) {
  return {
    id: data.id,
    lang,
    title: data.title[lang],
    description: data.description[lang],
    intro: data.intro[lang],
    rights: data.rights[lang],
    updatedAt: data.updatedAt,
    themes: data.themes.map((t) => ({ id: t.id, title: t.title[lang] })),
    sources: data.sources.map((s) => ({
      ...s,
      title: s.title[lang],
      description: s.description[lang],
    })),
    lenses: data.lenses.map((lens) => {
      const source = data.sources.find((s) => s.id === lens.sourceId);
      return {
        ...lens,
        title: lens.title[lang],
        originalTitle: lens.title.en,
        description: lens.description[lang],
        questions: lens.questions.map((q) => q[lang]),
        author: source.author,
        sourceTitle: source.title[lang],
        sourceUrl: source.url,
        url: absolute(`${lang}/lenses/#${lens.id}`),
      };
    }),
    counts: {
      total: data.lenses.length,
      schell: data.lenses.filter((l) => l.number !== null).length,
      additional: data.lenses.filter((l) => l.number === null).length,
    },
    url: absolute(`${lang}/lenses/`),
    markdownUrl: absolute(`content/lenses/${lang}/${data.id}.md`),
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
    provenance:
      'Original editorial explanations and review questions based on the user-selected Schell notes and attributed primary references. External concepts and source material retain their rights.',
  };
}

/** @param {ReturnType<typeof getLenses>} catalog */
export function lensesMarkdown(catalog) {
  const ru = catalog.lang === 'ru';
  return [
    `# ${catalog.title}`,
    '',
    catalog.intro,
    '',
    catalog.rights,
    '',
    ...catalog.themes.flatMap((theme) => [
      `## ${theme.title}`,
      '',
      ...catalog.lenses
        .filter((l) => l.theme === theme.id)
        .flatMap((lens) => [
          `### ${lens.number ? `${lens.number}. ` : ''}${lens.title}`,
          '',
          `id: ${lens.id}`,
          `${ru ? 'Автор' : 'Author'}: ${lens.author}`,
          `${ru ? 'Источник' : 'Source'}: [${lens.sourceTitle}](${lens.sourceUrl})`,
          '',
          lens.description,
          '',
          ...lens.questions.map((q) => `- ${q}`),
          '',
          `[${ru ? 'Оригинальный материал' : 'Original reference'}](${lens.referenceUrl}) · [${ru ? 'Прямая ссылка' : 'Permalink'}](${lens.url})`,
          '',
        ]),
    ]),
    `## ${ru ? 'Источники' : 'Sources'}`,
    '',
    ...catalog.sources.map((s) => `- [${s.title}](${s.url}): ${s.description}`),
    '',
  ].join('\n');
}

export function lensRecords() {
  return /** @type {const} */ (['ru', 'en']).map((lang) => {
    const catalog = getLenses(lang);
    return { ...catalog, body: lensesMarkdown(catalog) };
  });
}

export function validateLenses(value = data) {
  const errors = [];
  const check = (ok, message) => {
    if (!ok) errors.push(`lenses: ${message}`);
  };
  const text = (v) => typeof v === 'string' && v.trim().length > 0;
  const localized = (v, key) => {
    for (const lang of ['ru', 'en'])
      check(text(v?.[lang]), `${key}: missing ${lang}`);
  };
  const slug = (v) =>
    typeof v === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
  const https = (v) => {
    try {
      const u = new URL(v);
      return (
        u.protocol === 'https:' && !!u.hostname && !u.username && !u.password
      );
    } catch {
      return false;
    }
  };
  check(slug(value.id), 'invalid catalog id');
  const date = new Date(`${value.updatedAt}T00:00:00Z`);
  check(
    /^\d{4}-\d{2}-\d{2}$/.test(value.updatedAt) &&
      !Number.isNaN(date.valueOf()) &&
      date.toISOString().slice(0, 10) === value.updatedAt,
    'invalid editorial date',
  );
  for (const key of ['title', 'description', 'intro', 'rights'])
    localized(value[key], key);
  for (const key of ['themes', 'sources', 'lenses'])
    check(
      Array.isArray(value[key]) && value[key].length > 0,
      `${key} must be nonempty`,
    );
  if (![value.themes, value.sources, value.lenses].every(Array.isArray))
    return errors;
  const ids = new Set(['sources', 'use']);
  const identity = (id) => {
    check(slug(id) && !ids.has(id), `invalid or duplicate id ${id}`);
    ids.add(id);
  };
  for (const theme of value.themes) {
    identity(theme.id);
    localized(theme.title, theme.id);
    check(
      value.lenses.some((l) => l.theme === theme.id),
      `empty theme ${theme.id}`,
    );
  }
  for (const source of value.sources) {
    identity(source.id);
    localized(source.title, source.id);
    localized(source.description, `${source.id}/description`);
    check(
      text(source.author) && https(source.url),
      `invalid source ${source.id}`,
    );
  }
  const numbers = new Set();
  for (const lens of value.lenses) {
    identity(lens.id);
    localized(lens.title, lens.id);
    localized(lens.description, `${lens.id}/description`);
    check(
      value.themes.some((t) => t.id === lens.theme),
      `unknown theme for ${lens.id}`,
    );
    check(
      value.sources.some((s) => s.id === lens.sourceId),
      `unknown source for ${lens.id}`,
    );
    check(https(lens.referenceUrl), `invalid reference for ${lens.id}`);
    check(
      Array.isArray(lens.questions) && lens.questions.length >= 2,
      `missing questions for ${lens.id}`,
    );
    for (const q of lens.questions ?? []) localized(q, `${lens.id}/question`);
    if (lens.number !== null) {
      check(!numbers.has(lens.number), `duplicate number ${lens.number}`);
      numbers.add(lens.number);
      const fractional = lens.number.endsWith('½');
      const n = Number(lens.number.replace('½', ''));
      check(
        lens.id ===
          `schell-${String(n).padStart(3, '0')}${fractional ? '-5' : ''}`,
        `identity/number mismatch for ${lens.id}`,
      );
      check(
        lens.sourceId === (fractional ? 'schell-third' : 'schell-second'),
        `edition mismatch for ${lens.id}`,
      );
    } else
      check(
        lens.id === 'deterding-skill-atoms' && lens.sourceId === 'deterding',
        `unattributed external entry ${lens.id}`,
      );
  }
  const expected = [
    ...Array.from({ length: 113 }, (_, i) => String(i + 1)),
    '67½',
    '93½',
    '95½',
  ];
  check(
    numbers.size === expected.length && expected.every((n) => numbers.has(n)),
    'Schell coverage must be 1–113 plus 67½, 93½ and 95½',
  );
  check(
    value.lenses.length === 117 &&
      value.lenses.filter((l) => l.number === null).length === 1,
    'catalog must contain 116 Schell lenses and one separate Deterding entry',
  );
  return errors;
}
