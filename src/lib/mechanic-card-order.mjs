import data from '../data/mechanic-card-order.json' with { type: 'json' };

export const mechanicCardOrder = data;

/** Editorial production order; existing reference content is never a finished card. */
export function getMechanicCardQueue(records, order = data) {
  const byId = new Map(
    records
      .filter((r) => r.type === 'mechanic' && r.status === 'active')
      .map((r) => [r.id, r]),
  );
  return order.order
    .filter((id) => byId.has(id))
    .map((id, i) => ({
      rank: i + 1,
      record: byId.get(id),
      illustrated: Boolean(byId.get(id).attributes.preview),
    }));
}

export function validateMechanicCardOrder(records, order = data) {
  const errors = [];
  const active = new Set(
    records
      .filter((r) => r.type === 'mechanic' && r.status === 'active')
      .map((r) => r.id),
  );
  if (order.schemaVersion !== 1 || !Array.isArray(order.order))
    return ['mechanic-card-order: invalid schema'];
  for (const lang of ['ru', 'en'])
    if (!order.methodology?.[lang]?.trim())
      errors.push(`mechanic-card-order: missing ${lang} methodology`);
  const seen = new Set();
  for (const id of order.order) {
    if (seen.has(id)) errors.push(`mechanic-card-order: duplicate ${id}`);
    if (!active.has(id))
      errors.push(`mechanic-card-order: unknown or inactive ${id}`);
    seen.add(id);
  }
  for (const id of active)
    if (!seen.has(id)) errors.push(`mechanic-card-order: missing ${id}`);
  return errors;
}
