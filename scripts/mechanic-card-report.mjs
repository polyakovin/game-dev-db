import { buildKnowledge } from '../src/lib/knowledge.mjs';
import {
  getMechanicCardQueue,
  validateMechanicCardOrder,
} from '../src/lib/mechanic-card-order.mjs';

const records = buildKnowledge([], 'ru', []).records;
const errors = validateMechanicCardOrder(records);
if (errors.length) throw new Error(errors.join('\n'));
const queue = getMechanicCardQueue(records);
const ready = queue.filter((entry) => entry.illustrated).length;
if (process.argv.includes('--json')) {
  console.log(
    JSON.stringify(
      {
        total: queue.length,
        illustrated: ready,
        remaining: queue.length - ready,
        queue: queue.map(({ rank, record, illustrated }) => ({
          rank,
          id: record.id,
          title: record.title,
          url: record.url,
          illustrated,
        })),
      },
      null,
      2,
    ),
  );
} else {
  console.log(
    `Illustrated mechanics: ${ready}/${queue.length}; remaining: ${queue.length - ready}`,
  );
  for (const { rank, record } of queue
    .filter((entry) => !entry.illustrated)
    .slice(0, 30))
    console.log(`${rank}. ${record.id} | ${record.title}`);
}
if (process.argv.includes('--require-complete') && ready !== queue.length)
  process.exitCode = 1;
