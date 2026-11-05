import { CONTENT_ATTRIBUTION } from '../../../lib/site-config.mjs';
import { lessonRecords } from '../../../lib/content';
export async function GET() {
  return Response.json({
    schemaVersion: 1,
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: CONTENT_ATTRIBUTION,
    lessons: await lessonRecords(),
  });
}
