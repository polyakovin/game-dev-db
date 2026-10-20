import {
  getKnowledge,
  type KnowledgeRecord,
} from '../../../../../../lib/knowledge-content';
import { locales } from '../../../../../../lib/site';
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
  return Response.json({ schemaVersion: 1, record: props.record });
}
