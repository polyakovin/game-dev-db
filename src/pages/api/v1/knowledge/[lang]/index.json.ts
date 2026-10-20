import { getKnowledge } from '../../../../../lib/knowledge-content';
import { knowledgeIndex } from '../../../../../lib/knowledge.mjs';
import { locales } from '../../../../../lib/site';
export async function getStaticPaths() {
  return Promise.all(
    locales.map(async (lang) => ({
      params: { lang },
      props: { index: knowledgeIndex(await getKnowledge(lang)) },
    })),
  );
}
export function GET({ props }: { props: { index: unknown } }) {
  return Response.json(props.index);
}
