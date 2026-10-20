import priorities from '../data/content-order.json' with { type: 'json' };

/** @type {Record<string, string[]>} */
export const contentOrder = priorities;

/**
 * Lower positions mean greater editorial importance. Unranked siblings retain
 * their authored order after ranked entries. Always sort a copy.
 * @template T
 * @param {readonly T[]} items
 * @param {string} scope
 * @param {(item: T) => string} identify
 * @returns {T[]}
 */
export function orderByImportance(items, scope, identify) {
  const ranks = new Map((contentOrder[scope] ?? []).map((id, i) => [id, i]));
  return [...items].sort(
    (a, b) =>
      (ranks.get(identify(a)) ?? ranks.size) -
      (ranks.get(identify(b)) ?? ranks.size),
  );
}

/** @template {{id: string}} T @param {readonly T[]} items @param {string} scope */
export const orderEntries = (items, scope) =>
  orderByImportance(items, scope, (item) => item.id);

/**
 * Flatten groups in reading order while retaining unranked groups and entries.
 * @template T
 * @param {readonly T[]} items
 * @param {readonly {id: string}[]} groups
 * @param {(item: T) => string} groupFor
 * @param {(items: T[], group: string) => T[]} orderItems
 */
export function orderWithinGroups(items, groups, groupFor, orderItems) {
  const ids = [
    ...new Set([...groups.map((g) => g.id), ...items.map(groupFor)]),
  ];
  return ids.flatMap((id) =>
    orderItems(
      items.filter((item) => groupFor(item) === id),
      id,
    ),
  );
}

/** @template {{ id: string, sections: {id: string}[], families: { id: string, section: string, branches: {id: string, variants: {id: string}[]}[] }[], notes: {id: string, entries: {id: string}[]}[] }} T @param {T} catalog @returns {T} */
export function orderMechanicCatalog(catalog) {
  const scope = `mechanics/${catalog.id}`;
  const sections = orderEntries(catalog.sections, `${scope}/sections`);
  return {
    ...catalog,
    sections,
    families: orderWithinGroups(
      catalog.families,
      sections,
      (family) => family.section,
      (families, section) =>
        orderEntries(families, `${scope}/${section}/families`),
    ).map((family) => ({
      ...family,
      branches: orderEntries(
        family.branches,
        `${scope}/${family.id}/branches`,
      ).map((branch) => ({
        ...branch,
        variants: orderEntries(
          branch.variants,
          `${scope}/${branch.id}/variants`,
        ),
      })),
    })),
    notes: orderEntries(catalog.notes, `${scope}/notes`).map((note) => ({
      ...note,
      entries: orderEntries(note.entries, `${scope}/${note.id}/entries`),
    })),
  };
}

/** @param {Record<string, readonly string[]>} available @param {Record<string, string[]>} [orders] */
export function validateContentOrder(available, orders = contentOrder) {
  const errors = [];
  for (const [scope, ids] of Object.entries(orders)) {
    if (!available[scope]) {
      errors.push(`content-order: unknown scope ${scope}`);
      continue;
    }
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
      errors.push(`content-order: ${scope}: expected an array of identities`);
      continue;
    }
    if (new Set(ids).size !== ids.length)
      errors.push(`content-order: ${scope}: duplicate identity`);
    for (const id of ids)
      if (!available[scope].includes(id))
        errors.push(`content-order: ${scope}: unknown identity ${id}`);
  }
  return errors;
}
