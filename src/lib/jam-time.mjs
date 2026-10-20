/** @typedef {{ startsAt: string, endsAt: string }} JamTime */

/** @param {JamTime} event @param {number} [now] */
export function jamStatus(event, now = Date.now()) {
  const start = Date.parse(event.startsAt);
  const end = Date.parse(event.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= now)
    return 'closed';
  return start > now ? 'upcoming' : 'open';
}

/** @template {JamTime} T @param {T[]} events @param {number} [now] */
export function currentJams(events, now = Date.now()) {
  return events
    .filter((event) => jamStatus(event, now) !== 'closed')
    .sort((a, b) => {
      const aOpen = jamStatus(a, now) === 'open';
      const bOpen = jamStatus(b, now) === 'open';
      if (aOpen !== bOpen) return aOpen ? -1 : 1;
      return (
        Date.parse(aOpen ? a.endsAt : a.startsAt) -
        Date.parse(bOpen ? b.endsAt : b.startsAt)
      );
    });
}
