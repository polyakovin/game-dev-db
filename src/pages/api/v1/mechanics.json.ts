import { mechanicRecords } from '../../../lib/mechanics.mjs';
export function GET() {
  return Response.json({
    schemaVersion: 1,
    license: 'CC-BY-4.0',
    codeLicense: 'MIT',
    attribution: 'Game Dev DB contributors',
    catalogs: mechanicRecords(),
  });
}
