import { getCollection } from 'astro:content';
import { absolute, order, type Locale } from './site';

export async function getLessons(lang?: Locale) {
  const lessons = await getCollection('lessons');
  return lessons
    .filter((lesson) => !lang || lesson.data.lang === lang)
    .sort(
      (a, b) =>
        order.indexOf(a.data.id) - order.indexOf(b.data.id) ||
        a.data.lang.localeCompare(b.data.lang),
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
