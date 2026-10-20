import {
  getKnowledge,
  type KnowledgeDataset,
} from '../../../lib/knowledge-content';
import { locales } from '../../../lib/site';
export async function GET() {
  const sources = new Map<
    string,
    {
      id: string;
      url: string;
      titles: Record<string, string>;
      verifiedAt: string | null;
      usedBy: KnowledgeDataset['sources'][number]['usedBy'];
    }
  >();
  for (const lang of locales)
    for (const source of (await getKnowledge(lang)).sources) {
      const item = sources.get(source.id) ?? {
        id: source.id,
        url: source.url,
        titles: {},
        verifiedAt: source.verifiedAt,
        usedBy: [],
      };
      item.titles[lang] = source.title;
      item.usedBy.push(...source.usedBy);
      sources.set(source.id, item);
    }
  return Response.json({
    schemaVersion: 1,
    dateNote:
      'Editorial dates do not imply external-source verification. Unknown verification dates are null.',
    sources: [...sources.values()],
  });
}
