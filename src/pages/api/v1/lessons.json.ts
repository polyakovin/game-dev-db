import { lessonRecords } from '../../../lib/content';
export async function GET() {
  return Response.json({
    schemaVersion: 1,
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
    lessons: await lessonRecords(),
  });
}
