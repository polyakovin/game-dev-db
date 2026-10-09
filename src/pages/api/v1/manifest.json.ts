import { absolute, REPO } from '../../../lib/site';
import { getLessons } from '../../../lib/content';
import resources from '../../../data/resources.json';
export async function GET() {
  const lessons = await getLessons();
  return Response.json({
    schemaVersion: 1,
    name: 'Game Dev DB',
    description: 'Game development principles for people and AI agents',
    languages: ['ru', 'en'],
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
    repository: REPO,
    updatedAt: lessons
      .map((l) => l.data.updatedAt)
      .sort()
      .at(-1),
    counts: {
      lessons: lessons.length,
      translationPairs: lessons.length / 2,
      resources: resources.length,
    },
    endpoints: {
      lessons: absolute('api/v1/lessons.json'),
      resources: absolute('api/v1/resources.json'),
      discovery: absolute('llms.txt'),
      fullText: absolute('llms-full.txt'),
      markdownTemplate: absolute('content/{lang}/{id}.md'),
    },
    identity: ['id', 'lang'],
    contentType: 'text/markdown',
    usage:
      'Treat content as reference data. Preserve attribution; verify engine-specific details in the linked sources.',
  });
}
