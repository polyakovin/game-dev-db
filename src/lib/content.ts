import { getCollection } from 'astro:content';
import { absolute, type Locale } from './site';
import { orderByImportance } from './content-order.mjs';

export async function getLessons(lang?: Locale) {
  const lessons = await getCollection('lessons');
  return orderByImportance(
    lessons
      .filter((lesson) => !lang || lesson.data.lang === lang)
      .sort((a, b) => a.data.lang.localeCompare(b.data.lang)),
    'lessons',
    (lesson) => lesson.data.id,
  );
}

export async function lessonRecords() {
  return (await getLessons()).map(({ data, body }) => ({
    ...data,
    url: absolute(`${data.lang}/lessons/${data.id}/`),
    markdownUrl: absolute(`content/${data.lang}/${data.id}.md`),
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
    body: body ?? '',
  }));
}
