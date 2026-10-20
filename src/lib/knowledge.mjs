import { createHash } from 'node:crypto';
import relations from '../data/knowledge-relations.json' with { type: 'json' };
import aliases from '../data/knowledge-aliases.json' with { type: 'json' };
import { getMechanics } from './mechanics.mjs';
import { getPractice } from './practice.mjs';
import { getLenses } from './lenses.mjs';
import { getLearningPaths } from './learning-paths.mjs';
import { getResources } from './resources.mjs';
import { getJams } from './jams.mjs';
import { absolute } from './site.ts';
import { orderByImportance } from './content-order.mjs';
import { hasFocusedPage } from './discovery.mjs';

export const knowledgeTypes = [
  'lesson',
  'mechanic',
  'practice',
  'lens',
  'path',
  'resource',
  'jam',
  'calendar',
  'catalog',
];
export const typeLabels = {
  ru: {
    lesson: 'Урок',
    mechanic: 'Механика',
    practice: 'Упражнение',
    lens: 'Призма',
    path: 'Маршрут',
    resource: 'Ресурс',
    jam: 'Геймджем',
    calendar: 'Календарь',
    catalog: 'Справочник',
  },
  en: {
    lesson: 'Lesson',
    mechanic: 'Mechanic',
    practice: 'Exercise',
    lens: 'Lens',
    path: 'Learning path',
    resource: 'Resource',
    jam: 'Game jam',
    calendar: 'Calendar',
    catalog: 'Reference',
  },
};
export const relationLabels = {
  ru: {
    requires: ['Перед началом', 'Продолжить изучение'],
    explains: ['Применение принципа', 'Разобрать принцип'],
    practices: ['Применить на практике', 'Что помогает изучить'],
    reviews: ['Проверить через призму', 'Где применить призму'],
    contains: ['Материалы маршрута', 'Учебные маршруты'],
    uses: ['Источники в подборке', 'Используется в материалах'],
    related: ['Связанные материалы', 'Связанные материалы'],
    supersededBy: ['Актуальная версия', 'Предыдущая версия в архиве'],
  },
  en: {
    requires: ['Before you start', 'Continue learning'],
    explains: ['Apply the principle', 'Understand the principle'],
    practices: ['Put it into practice', 'What this helps you learn'],
    reviews: ['Review through a lens', 'Apply this lens'],
    contains: ['Path materials', 'Learning paths'],
    uses: ['Sources in the selection', 'Used in these materials'],
    related: ['Related materials', 'Related materials'],
    supersededBy: ['Current version', 'Previous archived version'],
  },
};

export function canonicalSourceUrl(value) {
  const url = new URL(value);
  url.hash = '';
  return url.href.replace(/\/$/, '');
}
export const sourceIdentity = (url) =>
  `source-${createHash('sha256').update(canonicalSourceUrl(url)).digest('hex').slice(0, 16)}`;

const list = (items) => items.map((item) => `- ${item}`).join('\n');
const section = (id, title, body) => ({ id, title, body });
const plain = (text) =>
  text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`#*_>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
export function lessonSections(body) {
  return [...body.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(
    (match, i) =>
      section(
        [
          'prerequisites',
          'principle',
          'example',
          'mistakes',
          'checks',
          'agent-task',
        ][i],
        match[1],
        match[2].trim(),
      ),
  );
}

/** Adapt authored data to one predictable representation. No Astro runtime required. */
export function buildKnowledge(lessons, lang, editorialRelations = relations) {
  lessons = orderByImportance(lessons, 'lessons', (lesson) => lesson.id);
  const ru = lang === 'ru';
  const records = new Map();
  const add = (type, id, title, summary, url, sections, options = {}) => {
    const key = `${type}/${id}`;
    const record = {
      key,
      type,
      id,
      lang,
      title,
      summary,
      updatedAt: null,
      status: 'active',
      url,
      jsonUrl: absolute(`api/v1/knowledge/${lang}/${type}/${id}.json`),
      markdownUrl: absolute(`content/knowledge/${lang}/${type}/${id}.md`),
      aliases: aliases[key] ?? [],
      tags: [],
      sourceIds: [],
      sources: [],
      sections,
      relations: [],
      placements: [],
      supersededBy: [],
      attributes: {},
      endsAt: null,
      provenance: ru
        ? 'Авторский материал Game Dev DB. Учебные примеры требуют проверки в своём проекте.'
        : 'Original Game Dev DB material. Check illustrative examples in your own project.',
      license: 'CC-BY-4.0',
      codeLicense: 'MIT',
      attribution: 'Game Dev DB contributors',
      ...options,
    };
    records.set(key, record);
    return record;
  };

  for (const lesson of lessons) {
    add(
      'lesson',
      lesson.id,
      lesson.title,
      lesson.description,
      absolute(`${lang}/lessons/${lesson.id}/`),
      lessonSections(lesson.body),
      {
        updatedAt: lesson.updatedAt,
        tags: lesson.tags,
        sources: lesson.sources,
        attributes: {
          category: lesson.category,
          level: lesson.level,
          minutes: lesson.minutes,
        },
      },
    );
  }
  for (const catalog of getMechanics(lang, { includeArchived: true })) {
    const context = add(
      'catalog',
      catalog.id,
      catalog.title,
      catalog.description,
      catalog.url,
      [
        section(
          'principle',
          ru ? 'О справочнике' : 'About this reference',
          catalog.intro,
        ),
        ...catalog.notes.map((note) =>
          section(
            note.id,
            note.title,
            [
              note.intro,
              ...note.entries.map((entry) =>
                [entry.title, entry.text].filter(Boolean).join('\n\n'),
              ),
            ]
              .filter(Boolean)
              .join('\n\n'),
          ),
        ),
      ],
      {
        updatedAt: catalog.updatedAt,
        status: catalog.status,
        supersededBy: catalog.supersededBy.map((id) => `catalog/${id}`),
        sources: catalog.sources,
        provenance: catalog.provenance,
      },
    );
    for (const family of catalog.families) {
      const id = family.canonicalId;
      const placement = {
        catalogId: catalog.id,
        id: family.id,
        title: catalog.title,
        url: `${catalog.url}#${family.id}`,
        categoryIds: family.categoryIds,
      };
      if (records.has(`mechanic/${id}`)) {
        const record = records.get(`mechanic/${id}`);
        record.placements.push(placement);
        record.tags = [
          ...new Set([
            ...record.tags,
            catalog.title,
            ...catalog.sections
              .filter((s) => family.categoryIds.includes(s.id))
              .map((s) => s.title),
          ]),
        ];
        record.sections.push(
          section(
            `context-${catalog.id}`,
            `${ru ? 'Контекст' : 'Context'}: ${catalog.title}`,
            catalog.intro,
          ),
        );
        for (const url of family.sourceUrls)
          if (!record.sources.some((s) => s.url === url))
            record.sources.push({
              title: catalog.sources.find((s) => s.url === url)?.title ?? url,
              url,
            });
        continue;
      }
      const variants = family.branches
        .map(
          (branch) =>
            `### ${branch.title}\n\n<a id="${branch.id}"></a>\n\n${branch.variants.map((v) => `- ${v.text} <a id="${v.id}"></a>`).join('\n')}`,
        )
        .join('\n\n');
      const sources = [
        ...family.sourceUrls.map((url) => ({
          title:
            catalog.sources.find((source) => source.url === url)?.title ?? url,
          url,
        })),
        ...family.references,
      ];
      add(
        'mechanic',
        id,
        family.title,
        family.description || family.title,
        placement.url,
        [
          section(
            'principle',
            ru ? 'Как работает' : 'How it works',
            family.description || family.title,
          ),
          section('variants', ru ? 'Варианты' : 'Variants', variants),
          ...(family.example
            ? [
                section(
                  'example',
                  ru ? 'Пример проектирования' : 'Design example',
                  family.example,
                ),
              ]
            : []),
          section(
            'context',
            ru ? 'Контекст и ограничения' : 'Context and limits',
            catalog.intro,
          ),
        ],
        {
          updatedAt: catalog.updatedAt,
          status: catalog.status,
          sources,
          placements: [placement],
          provenance: catalog.provenance,
          tags: [
            catalog.title,
            ...catalog.sections
              .filter((s) => family.categoryIds.includes(s.id))
              .map((s) => s.title),
          ],
          catalogKey: context.key,
        },
      );
    }
  }

  const practice = getPractice(lang);
  add(
    'catalog',
    `practice-${practice.id}`,
    practice.title,
    practice.description,
    practice.url,
    [
      section(
        'principle',
        ru ? 'О практикуме' : 'About the practice',
        `${practice.intro}\n\n${practice.durationNote}`,
      ),
    ],
    {
      updatedAt: practice.updatedAt,
      sources: practice.sources,
      provenance: practice.provenance,
    },
  );
  for (const task of practice.tasks) {
    add(
      'practice',
      task.id,
      task.title,
      task.goal,
      task.url,
      [
        section('goal', ru ? 'Цель' : 'Goal', task.goal),
        section(
          'example',
          ru ? 'Сценарий и материалы' : 'Scenario and materials',
          `${task.brief}\n\n${task.format}`,
        ),
        section(
          'constraints',
          ru ? 'Ограничения' : 'Constraints',
          list(task.constraints),
        ),
        section(
          'steps',
          ru ? 'Что сделать' : 'Steps',
          task.steps.map((s, i) => `${i + 1}. ${s}`).join('\n'),
        ),
        section('outcome', ru ? 'Результат' : 'Deliverable', task.deliverable),
        section(
          'checks',
          ru ? 'Проверка результата' : 'Check your work',
          list(task.checks),
        ),
        section(
          'reflection',
          ru ? 'После проверки' : 'Reflect',
          task.reflection,
        ),
      ],
      {
        updatedAt: practice.updatedAt,
        sources: practice.sources,
        provenance: practice.provenance,
        attributes: {
          topic: task.topic,
          level: task.level,
          minutes: task.minutes,
        },
        tags: [
          practice.topics.find((t) => t.id === task.topic)?.title ?? task.topic,
        ],
      },
    );
  }
  const lenses = getLenses(lang);
  add(
    'catalog',
    `lenses-${lenses.id}`,
    lenses.title,
    lenses.description,
    lenses.url,
    [
      section(
        'principle',
        ru ? 'О призмах' : 'About lenses',
        `${lenses.intro}\n\n${lenses.rights}`,
      ),
    ],
    {
      updatedAt: lenses.updatedAt,
      sources: lenses.sources,
      provenance: lenses.provenance,
    },
  );
  for (const lens of lenses.lenses) {
    add(
      'lens',
      lens.id,
      lens.title,
      lens.description,
      lens.url,
      [
        section('principle', ru ? 'Суть' : 'Principle', lens.description),
        section(
          'checks',
          ru ? 'Вопросы для проверки' : 'Review questions',
          list(lens.questions),
        ),
        section(
          'attribution',
          ru ? 'Авторство и границы' : 'Attribution and limits',
          `${lens.author} · ${lens.sourceTitle}\n\n${lenses.rights}`,
        ),
      ],
      {
        updatedAt: lenses.updatedAt,
        sources: [
          { title: lens.sourceTitle, url: lens.sourceUrl },
          { title: lens.originalTitle, url: lens.referenceUrl },
        ],
        aliases: [lens.originalTitle, lens.number ?? ''],
        attributes: {
          number: lens.number,
          theme: lens.theme,
          author: lens.author,
          originalTitle: lens.originalTitle,
          referenceUrl: lens.referenceUrl,
        },
        tags: [
          lenses.themes.find((t) => t.id === lens.theme)?.title ?? lens.theme,
        ],
        provenance: lenses.provenance,
      },
    );
  }
  for (const route of getLearningPaths(lang)) {
    add(
      'path',
      route.id,
      route.title,
      route.description,
      route.url,
      [
        section(
          'prerequisites',
          ru ? 'Перед началом' : 'Before you start',
          route.prerequisites.length
            ? list(
                route.prerequisites.map(
                  (l) => `[${records.get(`lesson/${l.id}`)?.title}](${l.url})`,
                ),
              )
            : ru
              ? 'Готовый проект не требуется.'
              : 'No existing project is required.',
        ),
        section(
          'sequence',
          ru ? 'Порядок изучения' : 'Lesson sequence',
          route.lessons
            .map(
              (l, i) =>
                `${i + 1}. [${records.get(`lesson/${l.id}`)?.title}](${l.url})`,
            )
            .join('\n'),
        ),
        section(
          'practice',
          ru ? 'Применить на практике' : 'Put it into practice',
          `${route.practiceRationale}\n\n${list(route.practice.map((p) => `[${records.get(`practice/${p.id}`)?.title}](${p.url})`))}`,
        ),
        section('outcome', ru ? 'Результат' : 'Outcome', route.outcome),
        section(
          'checks',
          ru ? 'Проверка результата' : 'Completion checks',
          list(route.checks),
        ),
      ],
      {
        updatedAt: route.updatedAt,
        attributes: {
          lessons: route.lessons,
          prerequisites: route.prerequisites,
          practice: route.practice,
          lenses: route.lenses,
        },
      },
    );
  }
  for (const resource of getResources()) {
    add(
      'resource',
      resource.id,
      resource.title[lang],
      resource.description[lang],
      absolute(`${lang}/resources/#resource-${resource.id}`),
      [
        section(
          'principle',
          ru ? 'Когда полезно' : 'When to use it',
          resource.description[lang],
        ),
        ...(resource.access
          ? [
              section(
                'access',
                ru ? 'Условия доступа' : 'Access',
                resource.access[lang],
              ),
            ]
          : []),
        ...(resource.practice
          ? [
              section(
                'practice',
                ru ? 'Попробуйте' : 'Try it',
                resource.practice[lang],
              ),
            ]
          : []),
      ],
      {
        sources: [{ title: resource.title[lang], url: resource.url }],
        attributes: {
          kind: resource.kind,
          format: resource.format ?? null,
          language: resource.language,
          authors: resource.authors?.[lang] ?? null,
        },
        tags: [resource.kind, resource.format ?? '', resource.category],
        provenance: ru
          ? 'Авторская рекомендация. Права на внешний материал остаются у его автора.'
          : 'Original editorial recommendation. The external material retains its author’s rights.',
      },
    );
  }
  const jams = getJams(lang);
  for (const event of jams.events) {
    add(
      'jam',
      event.id,
      event.title,
      event.description,
      absolute(`${lang}/jams/#${event.id}`),
      [
        section(
          'principle',
          ru ? 'О событии' : 'About the event',
          event.description,
        ),
        section(
          'requirements',
          ru ? 'Условия участия' : 'Entry requirements',
          event.requirements,
        ),
        section(
          'dates',
          ru ? 'Сроки' : 'Dates',
          `${event.startsAt}\n\n${event.endsAt}`,
        ),
      ],
      {
        updatedAt: event.verifiedAt,
        endsAt: event.endsAt,
        attributes: {
          organizer: event.organizer,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          verifiedAt: event.verifiedAt,
        },
        sources: [
          { title: event.title, url: event.url, verifiedAt: event.verifiedAt },
        ],
        provenance: jams.rights,
      },
    );
  }
  for (const calendar of jams.calendars) {
    add(
      'calendar',
      calendar.id,
      calendar.title,
      calendar.description,
      absolute(`${lang}/jams/#calendar-${calendar.id}`),
      [
        section(
          'principle',
          ru ? 'Что искать' : 'What to find',
          calendar.description,
        ),
      ],
      {
        updatedAt: calendar.verifiedAt ?? null,
        sources: [{ title: calendar.title, url: calendar.url }],
        provenance: jams.rights,
      },
    );
  }

  // Common records cite focused HTML pages; legacy collection exports and anchors
  // retain their original addresses. Resolve these before sources and graph links.
  for (const record of records.values()) {
    if (!hasFocusedPage(record)) continue;
    if (!record.placements.length)
      record.placements.push({
        title: ru ? 'В исходной подборке' : 'In the original collection',
        url: record.url,
      });
    record.url = absolute(`${lang}/knowledge/${record.type}/${record.id}/`);
  }

  const edges = new Map();
  const connect = (from, type, to) =>
    edges.set(`${from}|${type}|${to}`, { from, type, to });
  for (const record of records.values())
    for (const replacement of record.supersededBy)
      connect(record.key, 'supersededBy', replacement);
  for (const edge of editorialRelations) connect(edge.from, edge.type, edge.to);
  for (const lesson of lessons) {
    for (const match of lesson.body.matchAll(
      /\]\(\/game-dev-db\/(?:ru|en)\/(lessons|practice|lenses)\/(?:([^/#)]+)\/)?(?:#([^)]*))?\)/g,
    )) {
      const type = { lessons: 'lesson', practice: 'practice', lenses: 'lens' }[
        match[1]
      ];
      const target = `${type}/${match[3] || match[2]}`;
      if (target !== `lesson/${lesson.id}` && records.has(target))
        connect(
          `lesson/${lesson.id}`,
          type === 'practice'
            ? 'practices'
            : type === 'lens'
              ? 'reviews'
              : 'related',
          target,
        );
    }
  }
  for (const route of getLearningPaths(lang)) {
    for (const lesson of route.lessons)
      connect(`path/${route.id}`, 'contains', `lesson/${lesson.id}`);
    for (const lesson of route.prerequisites)
      connect(`path/${route.id}`, 'requires', `lesson/${lesson.id}`);
    for (const task of route.practice)
      connect(`path/${route.id}`, 'practices', `practice/${task.id}`);
    for (const lens of route.lenses)
      connect(`path/${route.id}`, 'reviews', `lens/${lens.id}`);
  }
  const resourcesByUrl = new Map(
    getResources().map((resource) => [
      canonicalSourceUrl(resource.url),
      `resource/${resource.id}`,
    ]),
  );
  const sources = new Map();
  for (const record of records.values()) {
    const unique = new Map();
    for (const source of record.sources) {
      const id = sourceIdentity(source.url);
      unique.set(id, {
        id,
        title: source.title,
        url: source.url,
        verifiedAt: source.verifiedAt ?? null,
      });
      if (!sources.has(id))
        sources.set(id, {
          id,
          url: canonicalSourceUrl(source.url),
          title: source.title,
          lang,
          verifiedAt: source.verifiedAt ?? null,
          usedBy: [],
        });
      if (source.verifiedAt) sources.get(id).verifiedAt = source.verifiedAt;
      if (!sources.get(id).usedBy.some((use) => use.key === record.key))
        sources.get(id).usedBy.push({
          key: record.key,
          lang,
          title: record.title,
          url: record.url,
        });
      const resource = resourcesByUrl.get(canonicalSourceUrl(source.url));
      if (resource && resource !== record.key)
        connect(record.key, 'uses', resource);
    }
    record.sources = [...unique.values()];
    record.sourceIds = [...unique.keys()];
  }
  for (const edge of edges.values()) {
    const from = records.get(edge.from),
      to = records.get(edge.to);
    if (!from || !to || !relationLabels[lang][edge.type]) continue;
    for (const [record, target, inverse] of [
      [from, to, false],
      [to, from, true],
    ]) {
      record.relations.push({
        type: edge.type,
        direction: inverse ? 'incoming' : 'outgoing',
        label: relationLabels[lang][edge.type][inverse ? 1 : 0],
        key: target.key,
        title: target.title,
        url: target.url,
        jsonUrl: target.jsonUrl,
        markdownUrl: target.markdownUrl,
      });
    }
  }
  return {
    schemaVersion: 1,
    lang,
    records: [...records.values()],
    sources: [...sources.values()],
    edges: [...edges.values()],
  };
}

export function knowledgeIndex(dataset, { search = false } = {}) {
  return {
    schemaVersion: 1,
    lang: dataset.lang,
    records: dataset.records
      .filter((r) => r.status === 'active')
      .map((record) => ({
        key: record.key,
        type: record.type,
        id: record.id,
        lang: record.lang,
        title: record.title,
        summary: record.summary,
        status: record.status,
        updatedAt: record.updatedAt,
        url: record.url,
        jsonUrl: record.jsonUrl,
        markdownUrl: record.markdownUrl,
        aliases: record.aliases,
        tags: record.tags,
        endsAt: record.endsAt,
        ...(search
          ? { text: plain(record.sections.map((s) => s.body).join(' ')) }
          : {}),
      })),
  };
}

export function knowledgeMarkdown(record) {
  return [
    `# ${record.title}`,
    '',
    `id: ${record.id}`,
    `type: ${record.type}`,
    `key: ${record.key}`,
    `lang: ${record.lang}`,
    `status: ${record.status}`,
    `url: ${record.url}`,
    '',
    record.summary,
    '',
    ...record.sections.flatMap((s) => [`## ${s.title}`, '', s.body, '']),
    '## ' +
      (record.lang === 'ru' ? 'Связанные материалы' : 'Connected materials'),
    '',
    ...record.relations.map(
      (r) => `- ${r.label}: [${r.title}](${r.url}) (key: ${r.key})`,
    ),
    '',
    '## ' +
      (record.lang === 'ru'
        ? 'Источники и происхождение'
        : 'Sources and provenance'),
    '',
    record.provenance,
    '',
    ...record.sources.map((s) => `- [${s.title}](${s.url}) (id: ${s.id})`),
    '',
    `${record.license} · ${record.attribution}`,
    '',
  ].join('\n');
}

export function validateKnowledge(dataset) {
  const errors = [],
    keys = new Set();
  for (const record of dataset.records) {
    if (keys.has(record.key))
      errors.push(`knowledge: duplicate identity ${record.key}`);
    keys.add(record.key);
    if (
      !knowledgeTypes.includes(record.type) ||
      !record.title?.trim() ||
      !record.summary?.trim()
    )
      errors.push(`knowledge: missing metadata ${record.key}`);
    if (
      !record.sections.length ||
      record.sections.some((s) => !s.id || !s.title?.trim() || !s.body?.trim())
    )
      errors.push(`knowledge: incomplete sections ${record.key}`);
    if (
      new Set(record.sections.map((s) => s.id)).size !== record.sections.length
    )
      errors.push(`knowledge: duplicate section ${record.key}`);
    if (record.lang !== dataset.lang)
      errors.push(`knowledge: wrong language ${record.key}`);
    if (!['active', 'archived'].includes(record.status))
      errors.push(`knowledge: invalid status ${record.key}`);
    if (
      record.updatedAt !== null &&
      !/^\d{4}-\d{2}-\d{2}$/.test(record.updatedAt)
    )
      errors.push(`knowledge: invalid date ${record.key}`);
  }
  for (const edge of dataset.edges) {
    if (!keys.has(edge.from) || !keys.has(edge.to))
      errors.push(`knowledge: dangling relation ${edge.from} → ${edge.to}`);
    if (!relationLabels.en[edge.type])
      errors.push(`knowledge: unknown relation type ${edge.type}`);
    if (edge.from === edge.to)
      errors.push(`knowledge: self relation ${edge.from}`);
  }
  const sourceIds = new Set(dataset.sources.map((s) => s.id));
  for (const record of dataset.records)
    for (const id of record.sourceIds)
      if (!sourceIds.has(id)) errors.push(`knowledge: unknown source ${id}`);
  const visiting = new Set(),
    visited = new Set();
  const dependencies = new Map();
  for (const edge of dataset.edges.filter((e) => e.type === 'requires'))
    dependencies.set(edge.from, [
      ...(dependencies.get(edge.from) ?? []),
      edge.to,
    ]);
  const visit = (key) => {
    if (visiting.has(key)) {
      errors.push(`knowledge: prerequisite cycle at ${key}`);
      return;
    }
    if (visited.has(key)) return;
    visiting.add(key);
    for (const next of dependencies.get(key) ?? []) visit(next);
    visiting.delete(key);
    visited.add(key);
  };
  for (const key of dependencies.keys()) visit(key);
  return errors;
}
