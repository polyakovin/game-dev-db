import { CONTENT_ATTRIBUTION } from '../../../lib/site-config.mjs';
import { mechanicRecords } from '../../../lib/mechanics.mjs';
export function GET() {
  return Response.json({
    schemaVersion: 1,
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: CONTENT_ATTRIBUTION,
    catalogs: mechanicRecords(),
  });
}
