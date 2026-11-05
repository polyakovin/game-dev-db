import { CONTENT_ATTRIBUTION } from '../../../lib/site-config.mjs';
import { learningPathRecords } from '../../../lib/learning-paths.mjs';

export function GET() {
  return Response.json({
    schemaVersion: 1,
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: CONTENT_ATTRIBUTION,
    paths: learningPathRecords(),
  });
}
