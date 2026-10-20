import matter from 'gray-matter';
import {
  getKnowledge,
  type KnowledgeRecord,
} from '../../../../../lib/knowledge-content';
import { knowledgeMarkdown } from '../../../../../lib/knowledge.mjs';
import { locales } from '../../../../../lib/site';
export async function getStaticPaths() {
  return (
    await Promise.all(
      locales.map(async (lang) =>
        (await getKnowledge(lang)).records.map((record) => ({
          params: { lang, type: record.type, id: record.id },
          props: { record },
        })),
      ),
    )
  ).flat();
}
export function GET({ props }: { props: { record: KnowledgeRecord } }) {
  const { sections, ...metadata } = props.record;
  return new Response(
    matter.stringify(knowledgeMarkdown(props.record), metadata),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
  );
}
