import type { APIRoute } from 'astro';
import matter from 'gray-matter';
import { practiceRecords } from '../../../../lib/practice.mjs';

export function getStaticPaths() {
  return practiceRecords().map((record) => ({
    params: { lang: record.lang, id: record.id },
    props: { record },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { tasks, topics, body, ...metadata } = props.record;
  return new Response(matter.stringify(body, metadata), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
