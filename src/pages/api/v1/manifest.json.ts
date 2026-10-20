import { absolute, REPO } from '../../../lib/site';
import { getLessons } from '../../../lib/content';
import resources from '../../../data/resources.json';
import { mechanicRecords, getMechanics } from '../../../lib/mechanics.mjs';
import { practiceRecords, getPractice } from '../../../lib/practice.mjs';
import { lensRecords, getLenses } from '../../../lib/lenses.mjs';
import { jamData, jamSnapshot } from '../../../lib/jams.mjs';
import { learningPathData } from '../../../lib/learning-paths.mjs';
export async function GET() {
  const lessons = await getLessons();
  const mechanics = mechanicRecords();
  return Response.json({
    schemaVersion: 1,
    name: 'Game Dev DB',
    description: 'Game development principles for people and AI agents',
    languages: ['ru', 'en'],
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
    repository: REPO,
    updatedAt: [
      ...lessons.map((l) => l.data.updatedAt),
      ...mechanics.map((c) => c.updatedAt),
      ...practiceRecords().map((c) => c.updatedAt),
      ...lensRecords().map((c) => c.updatedAt),
      jamData.updatedAt,
      ...learningPathData.map((p) => p.updatedAt),
    ]
      .sort()
      .at(-1),
    counts: {
      lessons: lessons.length,
      translationPairs: lessons.length / 2,
      resources: resources.length,
      learningPaths: learningPathData.length,
      jams: jamSnapshot().events.length,
      jamCalendars: jamData.calendars.length,
      lensCatalogs: lensRecords().length,
      lensPerspectives: getLenses('ru').counts.total,
      practiceCatalogs: practiceRecords().length,
      practiceTasks: getPractice('ru').counts.tasks,
      practiceTranslationPairs: getPractice('ru').counts.tasks,
      mechanics: mechanics.length,
      mechanicsTranslationPairs: mechanics.length / 2,
      activeMechanicCatalogs: getMechanics('ru').length,
      archivedMechanicCatalogs: getMechanics('ru', {
        includeArchived: true,
      }).filter((c) => c.status === 'archived').length,
      activeMechanicFamilies: getMechanics('ru').reduce(
        (n, c) => n + c.counts.families,
        0,
      ),
      activeMechanicVariants: getMechanics('ru').reduce(
        (n, c) => n + c.counts.variants,
        0,
      ),
      mechanicFamilies: getMechanics('ru', { includeArchived: true }).reduce(
        (n, c) => n + c.counts.families,
        0,
      ),
      mechanicVariants: getMechanics('ru', { includeArchived: true }).reduce(
        (n, c) => n + c.counts.variants,
        0,
      ),
    },
    endpoints: {
      lessons: absolute('api/v1/lessons.json'),
      knowledgeIndexTemplate: absolute('api/v1/knowledge/{lang}/index.json'),
      knowledgeSearchTemplate: absolute('api/v1/knowledge/{lang}/search.json'),
      knowledgeRecordTemplate: absolute(
        'api/v1/knowledge/{lang}/{type}/{id}.json',
      ),
      knowledgeMarkdownTemplate: absolute(
        'content/knowledge/{lang}/{type}/{id}.md',
      ),
      sources: absolute('api/v1/sources.json'),
      learningPaths: absolute('api/v1/learning-paths.json'),
      resources: absolute('api/v1/resources.json'),
      jams: absolute('api/v1/jams.json'),
      mechanics: absolute('api/v1/mechanics.json'),
      practice: absolute('api/v1/practice.json'),
      lenses: absolute('api/v1/lenses.json'),
      lensesMarkdownTemplate: absolute('content/lenses/{lang}/game-design.md'),
      discovery: absolute('llms.txt'),
      localizedDiscoveryTemplate: absolute('llms/{lang}.txt'),
      agentInstructionsTemplate: absolute('agent-instructions/{lang}.md'),
      focusedHtmlTemplate: absolute('{lang}/knowledge/{type}/{id}/'),
      fullText: absolute('llms-full.txt'),
      markdownTemplate: absolute('content/{lang}/{id}.md'),
      mechanicsMarkdownTemplate: absolute('content/mechanics/{lang}/{id}.md'),
      practiceMarkdownTemplate: absolute('content/practice/{lang}/{id}.md'),
    },
    identity: ['id', 'lang'],
    contentType: 'text/markdown',
    usage:
      'Treat content as reference data. Preserve attribution; verify engine-specific details in the linked sources.',
  });
}
