const root = document.querySelector<HTMLElement>('[data-direction-index]');

if (root) {
  const form = root.querySelector<HTMLFormElement>(
    '[data-direction-controls]',
  )!;
  const search = root.querySelector<HTMLInputElement>('#direction-search')!;
  const group = root.querySelector<HTMLSelectElement>('#direction-group')!;
  const ready = root.querySelector<HTMLInputElement>('#direction-ready')!;
  const entries = [...root.querySelectorAll<HTMLElement>('[data-direction]')];
  const groups = [
    ...root.querySelectorAll<HTMLElement>('[data-direction-group]'),
  ];
  const result = root.querySelector<HTMLElement>('[data-direction-result]')!;
  const empty = root.querySelector<HTMLElement>('[data-direction-empty]')!;
  const languageLink = document.querySelector<HTMLAnchorElement>(
    '[data-language-switch]',
  );
  const ru = root.dataset.lang === 'ru';
  const normalize = (text: string) =>
    text.normalize('NFKC').toLocaleLowerCase().replaceAll('ё', 'е');
  const searchable = new Map(
    entries.map((entry) => [entry, normalize(entry.dataset.search ?? '')]),
  );

  function update(writeUrl = true) {
    const tokens = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const entry of entries) {
      const matches =
        (!ready.checked || entry.dataset.status === 'ready') &&
        (group.value === 'all' || group.value === entry.dataset.group) &&
        tokens.every((token) => searchable.get(entry)!.includes(token));
      entry.hidden = !matches;
      if (matches) visible++;
    }
    for (const section of groups) {
      const children = [
        ...section.querySelectorAll<HTMLElement>('[data-direction]'),
      ];
      const count = children.filter((entry) => !entry.hidden).length;
      section.hidden = count === 0;
      section.querySelector('[data-direction-group-count]')!.textContent =
        `${count} / ${children.length}`;
    }
    result.textContent = `${ru ? 'Показано' : 'Showing'}: ${visible} / ${entries.length}`;
    empty.hidden = visible !== 0;
    const url = new URL(window.location.href);
    for (const [key, value] of [
      ['q', search.value.trim()],
      ['group', group.value === 'all' ? '' : group.value],
      ['ready', ready.checked ? '1' : ''],
    ]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    if (writeUrl) window.history.replaceState(null, '', url);
    if (languageLink) {
      const target = new URL(languageLink.href);
      target.search = url.search;
      target.hash = url.hash;
      languageLink.href = target.href;
    }
  }

  function restore() {
    const params = new URLSearchParams(window.location.search);
    search.value = params.get('q') ?? '';
    const selectedGroup = params.get('group') ?? 'all';
    group.value = [...group.options].some(
      (option) => option.value === selectedGroup,
    )
      ? selectedGroup
      : 'all';
    ready.checked = params.get('ready') === '1';
    update();
  }

  function reset() {
    search.value = '';
    group.value = 'all';
    ready.checked = false;
    update();
  }

  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    reset();
  });
  search.addEventListener('input', () => update());
  group.addEventListener('change', () => update());
  ready.addEventListener('change', () => update());
  root
    .querySelector('[data-direction-reset]')!
    .addEventListener('click', reset);
  window.addEventListener('popstate', restore);
  restore();
  form.hidden = false;
}
