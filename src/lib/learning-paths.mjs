import data from '../data/learning-paths.json' with { type: 'json' };
import { absolute } from './site.ts';

export const learningPathData = data;

/** @param {'ru' | 'en'} lang */
export function getLearningPaths(lang) {
  const lesson = (id) => ({
    id,
    url: absolute(`${lang}/lessons/${id}/`),
    markdownUrl: absolute(`content/${lang}/${id}.md`),
  });
  return data.map((entry) => ({
    id: entry.id,
    lang,
    title: entry.title[lang],
    description: entry.description[lang],
    updatedAt: entry.updatedAt,
    outcome: entry.outcome[lang],
    checks: entry.checks.map((check) => check[lang]),
    practiceRationale: entry.practiceRationale[lang],
    url: absolute(`${lang}/learn/${entry.id}/`),
    lessons: entry.lessons.map(lesson),
    prerequisites: entry.prerequisites.map(lesson),
    practice: entry.practice.map((id) => ({
      id,
      url: absolute(`${lang}/practice/#${id}`),
    })),
    lenses: entry.lenses.map((id) => ({
      id,
      url: absolute(`${lang}/lenses/#${id}`),
    })),
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
  }));
}

export function learningPathRecords() {
  return /** @type {const} */ (['ru', 'en']).flatMap(getLearningPaths);
}

/**
 * @param {{lessons: string[], practice: string[], lenses: string[]}} available
 * @param {typeof data} [paths]
 */
export function validateLearningPaths(available, paths = data) {
  const errors = [];
  const ids = new Set();
  for (const entry of paths) {
    const at = `learning-paths/${entry.id}`;
    if (
      typeof entry.id !== 'string' ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) ||
      ids.has(entry.id)
    )
      errors.push(`${at}: invalid or duplicate identity`);
    ids.add(entry.id);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.updatedAt) ||
      Number.isNaN(Date.parse(entry.updatedAt)) ||
      new Date(entry.updatedAt).toISOString().slice(0, 10) !== entry.updatedAt
    )
      errors.push(`${at}: invalid update date`);
    for (const lang of ['ru', 'en']) {
      for (const field of [
        'title',
        'description',
        'outcome',
        'practiceRationale',
      ])
        if (
          typeof entry[field]?.[lang] !== 'string' ||
          !entry[field][lang].trim()
        )
          errors.push(`${at}: missing ${field}.${lang}`);
      if (
        !Array.isArray(entry.checks) ||
        !entry.checks.length ||
        entry.checks.some(
          (check) => typeof check?.[lang] !== 'string' || !check[lang].trim(),
        )
      )
        errors.push(`${at}: missing checks.${lang}`);
    }
    for (const field of ['lessons', 'prerequisites', 'practice', 'lenses']) {
      const values = entry[field];
      if (
        !Array.isArray(values) ||
        (field !== 'prerequisites' && values.length === 0)
      ) {
        errors.push(`${at}: ${field} must be nonempty`);
        continue;
      }
      if (new Set(values).size !== values.length)
        errors.push(`${at}: duplicate ${field} reference`);
      for (const id of values) {
        if (field === 'lessons' || field === 'prerequisites') {
          for (const lang of ['ru', 'en'])
            if (!available.lessons.includes(`${lang}/${id}`))
              errors.push(`${at}: unknown lesson ${lang}/${id}`);
        } else if (!available[field].includes(id))
          errors.push(`${at}: unknown ${field} reference ${id}`);
      }
    }
    for (const id of Array.isArray(entry.lessons) ? entry.lessons : []) {
      if (entry.prerequisites?.includes(id))
        errors.push(`${at}: lesson ${id} is its own prerequisite`);
    }
  }
  if (paths.length === 0)
    errors.push('learning-paths: at least one path is required');
  return errors;
}
