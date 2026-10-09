import resources from '../../../data/resources.json';
export function GET() {
  return Response.json({
    schemaVersion: 1,
    license: 'CC-BY-4.0',
    attribution: 'Game Dev DB contributors',
    notice: 'Third-party materials retain their original licenses.',
    resources,
  });
}
