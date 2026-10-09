import type { APIRoute } from 'astro';
import matter from 'gray-matter';
import { mechanicRecords } from '../../../../lib/mechanics.mjs';
export function getStaticPaths() {
  return mechanicRecords().map((record) => ({
    params: { lang: record.lang, id: record.id },
    props: { record },
  }));
}
export const GET: APIRoute = ({ props }) => {
  const { families, sections, notes, body, ...metadata } = props.record;
  return new Response(matter.stringify(body, metadata), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
