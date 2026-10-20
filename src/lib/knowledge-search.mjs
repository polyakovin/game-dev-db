/** Shared by browser search and retrieval tests. */
export const normalizeKnowledgeQuery = (value) =>
  value
    .toLocaleLowerCase()
    .replaceAll('ё', 'е')
    .replace(/a\*/g, 'astar')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

export function searchKnowledge(
  records,
  query,
  type = 'all',
  now = Date.now(),
) {
  const terms = normalizeKnowledgeQuery(query).split(/\s+/).filter(Boolean);
  return records
    .filter(
      (record) =>
        record.status === 'active' &&
        (type === 'all' || record.type === type) &&
        (!record.endsAt || Date.parse(record.endsAt) > now),
    )
    .map((record, position) => {
      const fields = [
        record.title,
        (record.aliases ?? []).join(' '),
        record.summary,
        (record.tags ?? []).join(' '),
        record.text ?? '',
      ].map(normalizeKnowledgeQuery);
      if (!terms.every((term) => fields.some((field) => field.includes(term))))
        return null;
      const score = terms.reduce(
        (sum, term) =>
          sum +
          fields.reduce(
            (n, field, i) =>
              n + (field.includes(term) ? [12, 10, 6, 4, 1][i] : 0),
            0,
          ),
        0,
      );
      return { record, score, position };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.position - b.position)
    .map((entry) => entry.record);
}
