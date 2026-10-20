import { jamSnapshot } from '../../../lib/jams.mjs';

export function GET() {
  return Response.json(jamSnapshot());
}
