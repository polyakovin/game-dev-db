import { currentJams, jamStatus } from '../lib/jam-time.mjs';

const section = document.querySelector<HTMLElement>('[data-jam-events]');
if (section) {
  const list = section.querySelector<HTMLElement>('[data-jam-list]')!;
  const empty = section.querySelector<HTMLElement>('[data-jam-empty]')!;
  const count = section.querySelector<HTMLElement>('[data-jam-count]')!;
  const events = [...section.querySelectorAll<HTMLElement>('[data-jam]')].map(
    (card) => ({
      card,
      startsAt: card.dataset.startsAt!,
      endsAt: card.dataset.endsAt!,
    }),
  );
  let timer: ReturnType<typeof setTimeout>;
  function refresh() {
    clearTimeout(timer);
    const now = Date.now();
    const current = currentJams(events, now);
    for (const event of events) {
      const status = jamStatus(event, now);
      event.card.hidden = status === 'closed';
      const label = event.card.querySelector<HTMLElement>('[data-jam-status]')!;
      label.textContent =
        status === 'open'
          ? section!.dataset.openLabel!
          : section!.dataset.upcomingLabel!;
      label.classList.toggle('is-open', status === 'open');
    }
    // Avoid moving cards already in order: moving a focused link's ancestor
    // would interrupt keyboard navigation during a timer refresh.
    let cursor = list.firstElementChild;
    for (const event of current) {
      while (cursor instanceof HTMLElement && cursor.hidden)
        cursor = cursor.nextElementSibling;
      if (cursor !== event.card) list.insertBefore(event.card, cursor);
      cursor = event.card.nextElementSibling;
    }
    count.textContent = String(current.length);
    empty.hidden = current.length > 0;
    section!.dataset.ready = '';
    const transitions = events
      .flatMap((event) => [
        Date.parse(event.startsAt),
        Date.parse(event.endsAt),
      ])
      .filter((time) => time > now);
    timer = setTimeout(
      refresh,
      Math.min(60_000, ...transitions.map((time) => time - now)),
    );
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh();
  });
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
  refresh();
}
