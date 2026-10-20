for (const nav of document.querySelectorAll<HTMLElement>('[data-toc]')) {
  const entries = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
    .map((link) => ({
      link,
      target: document.getElementById(decodeURIComponent(link.hash.slice(1))),
    }))
    .filter(
      (entry): entry is { link: HTMLAnchorElement; target: HTMLElement } =>
        Boolean(entry.target),
    );
  let current: HTMLAnchorElement | undefined;
  let pending = false;

  const update = () => {
    pending = false;
    const visible = entries.filter(
      ({ target }) => target.getClientRects().length,
    );
    let active = visible.at(0);
    for (const entry of visible) {
      if (entry.target.getBoundingClientRect().top <= 32) active = entry;
    }
    // Short final sections must also become current at the end of the page.
    if (
      window.scrollY > 0 &&
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
    ) {
      active = visible.at(-1);
    }
    if (current === active?.link) return;
    current?.removeAttribute('aria-current');
    current = active?.link;
    current?.setAttribute('aria-current', 'location');
  };
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', schedule);
  const observer = new ResizeObserver(schedule);
  const content = document.querySelector<HTMLElement>('[data-toc-content]');
  if (content) observer.observe(content);
  for (const { target } of entries) observer.observe(target);
  schedule();
}

export {};
