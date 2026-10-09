import { getLessons } from '../../../lib/content';
import type { APIRoute } from 'astro';
import matter from 'gray-matter';
import { absolute } from '../../../lib/site';
const sources = import.meta.glob('../../../content/lessons/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
export async function getStaticPaths() {
  return (await getLessons()).map(({ data }) => ({
    params: { lang: data.lang, id: data.id },
  }));
}
export const GET: APIRoute = async ({ params }) => {
  const content = sources[
    `../../../content/lessons/${params.lang}/${params.id}.md`
  ] as string;
  const { data, content: body } = matter(content);
  const exported = matter.stringify(body, {
    ...data,
    url: absolute(`${params.lang}/lessons/${params.id}/`),
    markdownUrl: absolute(`content/${params.lang}/${params.id}.md`),
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
  });
  return new Response(exported, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
