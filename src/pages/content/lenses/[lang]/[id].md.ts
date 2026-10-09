import type { APIRoute } from 'astro';
import matter from 'gray-matter';
import { lensRecords } from '../../../../lib/lenses.mjs';
export function getStaticPaths() {
  return lensRecords().map((record) => ({
    params: { lang: record.lang, id: record.id },
    props: { record },
  }));
}
export const GET: APIRoute = ({ props }) => {
  const { themes, lenses, body, ...metadata } = props.record;
  return new Response(matter.stringify(body, metadata), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
