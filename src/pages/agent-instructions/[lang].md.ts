import { agentInstructions } from '../../lib/discovery.mjs';
import { locales, type Locale } from '../../lib/site';
export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}
export function GET({ params }: { params: { lang: Locale } }) {
  return new Response(agentInstructions(params.lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
