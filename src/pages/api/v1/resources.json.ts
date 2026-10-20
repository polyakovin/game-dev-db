import { getResources } from '../../../lib/resources.mjs';
export function GET() {
  return Response.json({
    schemaVersion: 1,
    license: 'CC-BY-4.0',
    attribution: 'Game Dev DB contributors',
    notice: 'Third-party materials retain their original licenses.',
    resources: getResources(),
  });
}
