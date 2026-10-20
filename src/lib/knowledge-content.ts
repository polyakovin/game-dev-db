import { getLessons } from './content';
import { buildKnowledge } from './knowledge.mjs';
import type { Locale } from './site';

export interface KnowledgeRelation {
  type: string;
  direction: string;
  label: string;
  key: string;
  title: string;
  url: string;
  jsonUrl: string;
  markdownUrl: string;
}
export interface KnowledgeRecord {
  key: string;
  type: string;
  id: string;
  lang: Locale;
  title: string;
  summary: string;
  updatedAt: string | null;
  status: string;
  url: string;
  jsonUrl: string;
  markdownUrl: string;
  aliases: string[];
  tags: string[];
  sourceIds: string[];
  sources: { id: string; title: string; url: string }[];
  sections: { id: string; title: string; body: string }[];
  relations: KnowledgeRelation[];
  supersededBy: string[];
  license: string;
  codeLicense: string;
  attribution: string;
  provenance: string;
}
export interface KnowledgeDataset {
  schemaVersion: number;
  lang: Locale;
  records: KnowledgeRecord[];
  sources: {
    id: string;
    url: string;
    title: string;
    lang: string;
    verifiedAt: string | null;
    usedBy: { key: string; lang: string; title: string; url: string }[];
  }[];
  edges: { from: string; to: string; type: string }[];
}
const cache = new Map<
  Locale,
  { fingerprint: string; dataset: KnowledgeDataset }
>();
export async function getKnowledge(lang: Locale): Promise<KnowledgeDataset> {
  const lessons = (await getLessons(lang)).map(({ data, body }) => ({
    ...data,
    body: body ?? '',
  }));
  const fingerprint = JSON.stringify(lessons);
  if (cache.get(lang)?.fingerprint !== fingerprint)
    cache.set(lang, {
      fingerprint,
      dataset: buildKnowledge(lessons, lang) as KnowledgeDataset,
    });
  return cache.get(lang)!.dataset;
}
