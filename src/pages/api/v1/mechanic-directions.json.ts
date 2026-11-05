import { CONTENT_ATTRIBUTION } from '../../../lib/site-config.mjs';
import { mechanicDirectionRecords } from '../../../lib/mechanic-directions.mjs';

export function GET() {
  return new Response(
    JSON.stringify({
      schemaVersion: 1,
      license: 'CC-BY-4.0',
      attribution: CONTENT_ATTRIBUTION,
      indexes: mechanicDirectionRecords(),
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
}
