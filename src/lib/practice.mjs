import source from '../data/practice.json' with { type: 'json' };
import { absolute } from './site.ts';

export const practiceSource = source;

/** @param {'ru' | 'en'} lang */
export function getPractice(lang) {
  const url = absolute(`${lang}/practice/`);
  return {
    id: source.id,
    lang,
    title: source.title[lang],
    description: source.description[lang],
    intro: source.intro[lang],
    durationNote: source.durationNote[lang],
    provenance: source.provenance[lang],
    updatedAt: source.updatedAt,
    topics: source.topics.map((topic) => ({
      id: topic.id,
      title: topic.title[lang],
    })),
    tasks: source.tasks.map((task) => ({
      id: task.id,
      topic: task.topic,
      level: task.level,
      minutes: task.minutes,
      ...task.content[lang],
      url: `${url}#${task.id}`,
    })),
    sources: source.sources.map((item) => ({
      title: item.title[lang],
      url: item.url,
      description: item.description[lang],
    })),
    counts: { tasks: source.tasks.length },
    url,
    markdownUrl: absolute(`content/practice/${lang}/${source.id}.md`),
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
  };
}

/** @param {ReturnType<typeof getPractice>} catalog */
export function practiceMarkdown(catalog) {
  const ru = catalog.lang === 'ru';
  const labels = ru
    ? [
        'Цель',
        'Материалы',
        'Ограничения',
        'Что сделать',
        'Результат',
        'Проверьте себя',
        'После проверки',
        'Источники',
      ]
    : [
        'Goal',
        'Materials',
        'Constraints',
        'Steps',
        'Deliverable',
        'Check your work',
        'Reflect',
        'Sources',
      ];
  const list = (values, ordered = false) =>
    values.map((value, i) => `${ordered ? `${i + 1}.` : '-'} ${value}`);
  return [
    `# ${catalog.title}`,
    '',
    catalog.intro,
    '',
    catalog.durationNote,
    '',
    catalog.provenance,
    '',
    ...catalog.tasks.flatMap((task, i) => [
      `## ${String(i + 1).padStart(2, '0')}. ${task.title}`,
      '',
      `id: ${task.id}`,
      `url: ${task.url}`,
      `${ru ? 'Тема' : 'Topic'}: ${catalog.topics.find((topic) => topic.id === task.topic)?.title}`,
      `${ru ? 'Уровень' : 'Level'}: ${task.level === 'beginner' ? (ru ? 'Начальный' : 'Beginner') : ru ? 'Средний' : 'Intermediate'}`,
      `${ru ? 'Ориентир времени' : 'Estimated duration'}: ${task.minutes} ${ru ? 'мин' : 'min'}`,
      '',
      `**${labels[0]}:** ${task.goal}`,
      '',
      task.brief,
      '',
      `**${labels[1]}:** ${task.format}`,
      '',
      `### ${labels[2]}`,
      '',
      ...list(task.constraints),
      '',
      `### ${labels[3]}`,
      '',
      ...list(task.steps, true),
      '',
      `### ${labels[4]}`,
      '',
      task.deliverable,
      '',
      `### ${labels[5]}`,
      '',
      ...list(task.checks),
      '',
      `**${labels[6]}:** ${task.reflection}`,
      '',
    ]),
    `## ${labels[7]}`,
    '',
    ...catalog.sources.map(
      (item) => `- [${item.title}](${item.url}): ${item.description}`,
    ),
    '',
  ].join('\n');
}

export function practiceRecords() {
  return /** @type {const} */ (['ru', 'en']).map((lang) => {
    const catalog = getPractice(lang);
    return { ...catalog, body: practiceMarkdown(catalog) };
  });
}

export function validatePractice(data = source) {
  const errors = [];
  const check = (ok, at, message) => {
    if (!ok) errors.push(`practice/${at}: ${message}`);
  };
  const text = (value) => typeof value === 'string' && value.trim().length > 0;
  const slug = (value) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  const localized = (value, at) => {
    for (const lang of ['ru', 'en'])
      check(text(value?.[lang]), at, `missing ${lang} text`);
  };
  if (!data || typeof data !== 'object')
    return ['practice: source must be an object'];
  check(slug(data.id), 'id', 'invalid catalog id');
  const date = new Date(`${data.updatedAt}T00:00:00Z`);
  check(
    /^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt) &&
      !Number.isNaN(date.valueOf()) &&
      date.toISOString().slice(0, 10) === data.updatedAt,
    'updatedAt',
    'invalid editorial date',
  );
  for (const key of [
    'title',
    'description',
    'intro',
    'durationNote',
    'provenance',
  ])
    localized(data[key], key);
  for (const key of ['topics', 'sources', 'tasks'])
    check(
      Array.isArray(data[key]) && data[key].length > 0,
      key,
      'must be a nonempty array',
    );
  if (
    !Array.isArray(data.topics) ||
    !Array.isArray(data.sources) ||
    !Array.isArray(data.tasks)
  )
    return errors;
  const topics = new Set();
  for (const topic of data.topics) {
    check(
      slug(topic?.id) && !topics.has(topic.id),
      'topics',
      'invalid or duplicate topic id',
    );
    topics.add(topic?.id);
    localized(topic?.title, `topics/${topic?.id}`);
  }
  const sourceUrls = new Set();
  for (const item of data.sources) {
    localized(item?.title, 'sources/title');
    localized(item?.description, 'sources/description');
    let valid = false;
    try {
      const url = new URL(item?.url);
      valid =
        url.protocol === 'https:' &&
        Boolean(url.hostname) &&
        !url.username &&
        !url.password;
    } catch {}
    check(
      valid && !sourceUrls.has(item?.url),
      'sources',
      'invalid or duplicate source URL',
    );
    sourceUrls.add(item?.url);
  }
  const ids = new Set(['sources', 'catalog', 'main']);
  for (const task of data.tasks) {
    const at = task?.id ?? 'task';
    check(
      slug(task?.id) && !ids.has(task.id),
      at,
      'invalid or duplicate exercise id',
    );
    ids.add(task?.id);
    check(topics.has(task?.topic), at, 'unknown topic');
    check(
      ['beginner', 'intermediate'].includes(task?.level),
      at,
      'invalid level',
    );
    check(
      Number.isInteger(task?.minutes) &&
        task.minutes > 0 &&
        task.minutes <= 120,
      at,
      'minutes must be an integer from 1 to 120',
    );
    for (const lang of ['ru', 'en']) {
      const content = task?.content?.[lang];
      for (const key of [
        'title',
        'format',
        'goal',
        'brief',
        'deliverable',
        'reflection',
      ])
        check(text(content?.[key]), `${at}/${lang}/${key}`, 'missing text');
      for (const key of ['constraints', 'steps', 'checks'])
        check(
          Array.isArray(content?.[key]) &&
            content[key].length > 0 &&
            content[key].every(text),
          `${at}/${lang}/${key}`,
          'must be a nonempty list of text',
        );
    }
    for (const key of ['constraints', 'steps', 'checks'])
      check(
        task?.content?.ru?.[key]?.length === task?.content?.en?.[key]?.length,
        `${at}/${key}`,
        'translation list lengths differ',
      );
  }
  return errors;
}
