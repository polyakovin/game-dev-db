import { getKnowledge } from '../../lib/knowledge-content';
import { agentTopicIndex } from '../../lib/discovery.mjs';
import { locales, type Locale } from '../../lib/site';
export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}
export async function GET({ params }: { params: { lang: Locale } }) {
  return new Response(agentTopicIndex(await getKnowledge(params.lang)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
