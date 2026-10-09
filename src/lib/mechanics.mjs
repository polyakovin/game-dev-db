import voice from '../data/mechanics/voice-audio.json' with { type: 'json' };
import point from '../data/mechanics/point-and-click.json' with { type: 'json' };
import children from '../data/mechanics/children-education.json' with { type: 'json' };
import { absolute } from './site.ts';

export const mechanicCatalogs = [voice, point, children];

/** @param {'ru' | 'en'} lang */
export function getMechanics(lang) {
  return mechanicCatalogs.map((catalog) => {
    const families = catalog.families.map((family) => ({
      id: family.id,
      section: family.section,
      title: family.title[lang],
      description: family.description[lang],
      example: family.example[lang],
      sourceUrls: family.sourceUrls,
      branches: family.branches.map((branch) => ({
        id: branch.id,
        title: branch.title[lang],
        variants: branch.variants.map((variant) => ({
          id: variant.id,
          text: variant.text[lang],
        })),
      })),
    }));
    return {
      id: catalog.id,
      lang,
      title: catalog.title[lang],
      description: catalog.description[lang],
      intro: catalog.intro[lang],
      updatedAt: catalog.updatedAt,
      sections: catalog.sections.map((section) => ({
        id: section.id,
        title: section.title[lang],
      })),
      families,
      notes: catalog.notes.map((note) => ({
        id: note.id,
        title: note.title[lang],
        intro: note.intro[lang],
        entries: note.entries.map((entry) => ({
          id: entry.id,
          title: entry.title[lang],
          text: entry.text[lang],
        })),
      })),
      sources: catalog.sources.map((source) => ({
        title: source.title[lang],
        url: source.url,
        description: source.description[lang],
      })),
      counts: {
        families: families.length,
        branches: families.reduce((n, f) => n + f.branches.length, 0),
        variants: families.reduce(
          (n, f) =>
            n + f.branches.reduce((sum, b) => sum + b.variants.length, 0),
          0,
        ),
      },
      url: absolute(`${lang}/mechanics/${catalog.id}/`),
      markdownUrl: absolute(`content/mechanics/${lang}/${catalog.id}.md`),
      license: 'CC-BY-4.0',
      codeLicense: 'MIT',
      attribution: 'Game Dev DB contributors',
      provenance:
        'Original taxonomy adapted from user-selected design discussions; linked sources support specific examples, not the whole classification.',
    };
  });
}

/** @param {ReturnType<typeof getMechanics>[number]} catalog */
export function mechanicsMarkdown(catalog) {
  const ru = catalog.lang === 'ru';
  return [
    `# ${catalog.title}`,
    '',
    catalog.intro,
    '',
    ...catalog.sections.flatMap((section) => [
      `## ${section.title}`,
      '',
      ...catalog.families
        .filter((f) => f.section === section.id)
        .flatMap((f) => [
          `### ${f.id.slice(-2)}. ${f.title}`,
          '',
          ...(f.description ? [f.description, ''] : []),
          ...f.branches.flatMap((branch) => [
            `#### ${branch.title}`,
            '',
            ...branch.variants.map((v) => `- ${v.text}`),
            '',
          ]),
          ...(f.example
            ? [
                `${ru ? 'Пример проектирования' : 'Design example'}: ${f.example}`,
                '',
              ]
            : []),
          ...f.sourceUrls.map((url) => {
            const source = catalog.sources.find((s) => s.url === url);
            return `- [${source?.title ?? url}](${url})`;
          }),
          '',
        ]),
    ]),
    ...catalog.notes.flatMap((note) => [
      `## ${note.title}`,
      '',
      note.intro,
      '',
      ...note.entries.flatMap((entry) => [
        ...(entry.title ? [`### ${entry.title}`, ''] : []),
        entry.text,
        '',
      ]),
    ]),
    `## ${ru ? 'Источники и примеры' : 'Sources and examples'}`,
    '',
    ru
      ? 'Источники подтверждают отдельные приёмы или методологию. Они не подтверждают все варианты семейства. Примеры проектирования и сочетания механик являются иллюстрациями.'
      : 'Sources support particular techniques or methodology, not every family variant. Design examples and mechanic combinations are illustrative.',
    '',
    ...catalog.sources.map((s) => `- [${s.title}](${s.url}): ${s.description}`),
    '',
  ].join('\n');
}

export function mechanicRecords() {
  return /** @type {const} */ (['ru', 'en']).flatMap((lang) =>
    getMechanics(lang).map((catalog) => ({
      ...catalog,
      body: mechanicsMarkdown(catalog),
    })),
  );
}

/** @param {unknown[]} [catalogs] */
export function validateMechanics(catalogs = mechanicCatalogs) {
  const errors = [];
  const nonempty = (value) =>
    typeof value === 'string' && value.trim().length > 0;
  const check = (ok, location, message) => {
    if (!ok) errors.push(`${location}: ${message}`);
  };
  const localized = (value, location, optional = false) => {
    for (const lang of ['ru', 'en']) {
      check(
        typeof value?.[lang] === 'string' &&
          (optional || nonempty(value[lang])),
        location,
        `missing ${lang} text`,
      );
    }
    if (optional)
      check(
        Boolean(value?.ru) === Boolean(value?.en),
        location,
        'optional text must exist in both languages',
      );
  };
  const catalogIds = new Set();
  for (const c of catalogs) {
    if (!c || typeof c !== 'object') {
      errors.push('Catalog must be an object');
      continue;
    }
    const catalog = /** @type {typeof voice} */ (c);
    const location = `mechanics/${catalog.id}`;
    check(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(catalog.id),
      location,
      'invalid catalog id',
    );
    check(!catalogIds.has(catalog.id), location, 'duplicate catalog id');
    catalogIds.add(catalog.id);
    const date = new Date(`${catalog.updatedAt}T00:00:00Z`);
    check(
      /^\d{4}-\d{2}-\d{2}$/.test(catalog.updatedAt) &&
        !Number.isNaN(date.valueOf()) &&
        date.toISOString().slice(0, 10) === catalog.updatedAt,
      location,
      'invalid editorial date',
    );
    for (const key of ['title', 'description', 'intro'])
      localized(catalog[key], `${location}/${key}`);
    const ids = new Set(['sources']);
    const identity = (id) => {
      check(
        typeof id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id),
        location,
        'invalid structural id',
      );
      check(!ids.has(id), location, `duplicate structural id ${id}`);
      ids.add(id);
    };
    for (const list of ['sections', 'families', 'sources'])
      check(
        Array.isArray(catalog[list]) && catalog[list].length > 0,
        location,
        `${list} must be nonempty`,
      );
    if (
      !Array.isArray(catalog.sections) ||
      !Array.isArray(catalog.families) ||
      !Array.isArray(catalog.sources)
    )
      continue;
    const sections = new Set(catalog.sections.map((s) => s.id));
    const sourceUrls = new Set();
    for (const s of catalog.sources) {
      localized(s.title, `${location}/source/title`);
      localized(s.description, `${location}/source/description`);
      let valid = false;
      try {
        const u = new URL(s.url);
        valid =
          u.protocol === 'https:' && !!u.hostname && !u.username && !u.password;
      } catch {}
      check(
        valid && !sourceUrls.has(s.url),
        location,
        'invalid or duplicate source URL',
      );
      sourceUrls.add(s.url);
    }
    for (const s of catalog.sections) {
      identity(s.id);
      localized(s.title, `${location}/${s.id}`);
      check(
        catalog.families.some((f) => f.section === s.id),
        location,
        `empty section ${s.id}`,
      );
    }
    for (const f of catalog.families) {
      identity(f.id);
      localized(f.title, `${location}/${f.id}/title`);
      localized(f.description, `${location}/${f.id}/description`, true);
      localized(f.example, `${location}/${f.id}/example`, true);
      check(sections.has(f.section), location, `unknown section ${f.section}`);
      check(
        Array.isArray(f.sourceUrls) &&
          f.sourceUrls.every((url) => sourceUrls.has(url)),
        location,
        'unlisted family source',
      );
      check(
        Array.isArray(f.branches) && f.branches.length > 0,
        location,
        'missing branches',
      );
      for (const b of f.branches ?? []) {
        identity(b.id);
        localized(b.title, `${location}/${b.id}`);
        check(
          Array.isArray(b.variants) && b.variants.length > 0,
          location,
          'missing variants',
        );
        for (const v of b.variants ?? []) {
          identity(v.id);
          localized(v.text, `${location}/${v.id}`);
        }
      }
    }
    for (const n of catalog.notes ?? []) {
      identity(n.id);
      localized(n.title, `${location}/${n.id}`);
      localized(n.intro, `${location}/${n.id}/intro`, true);
      check(
        Array.isArray(n.entries) && n.entries.length > 0,
        location,
        'empty design note',
      );
      for (const e of n.entries ?? []) {
        identity(e.id);
        localized(e.title, `${location}/${e.id}/title`, true);
        localized(e.text, `${location}/${e.id}`);
      }
    }
  }
  return errors;
}
