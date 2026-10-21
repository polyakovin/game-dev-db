const library = document.querySelector<HTMLElement>('[data-card-library]');
const controls = library?.querySelector<HTMLFormElement>(
  '[data-card-library-controls]',
);
if (library && controls) {
  const input = controls.querySelector<HTMLInputElement>(
    '[data-card-library-query]',
  )!;
  const items = [
    ...library.querySelectorAll<HTMLElement>('[data-card-library-item]'),
  ];
  const count = controls.querySelector<HTMLElement>(
    '[data-card-library-count]',
  )!;
  const empty = library.querySelector<HTMLElement>(
    '[data-card-library-empty]',
  )!;
  const ru = document.documentElement.lang === 'ru';
  const update = () => {
    const words = input.value
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    let visible = 0;
    for (const item of items) {
      item.hidden = !words.every((word) =>
        item.dataset.cardSearch!.includes(word),
      );
      if (!item.hidden) visible++;
    }
    count.textContent = `${ru ? 'Найдено' : 'Matches'}: ${visible} / ${items.length}`;
    empty.hidden = visible !== 0;
    const url = new URL(location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    const language = document.querySelector<HTMLAnchorElement>(
      '[data-language-switch]',
    );
    if (language) {
      const alternate = new URL(language.href);
      alternate.search = url.search;
      language.href = alternate.href;
    }
  };
  controls.hidden = false;
  input.value = new URL(location.href).searchParams.get('q') ?? '';
  controls.addEventListener('submit', (event) => event.preventDefault());
  input.addEventListener('input', update);
  update();
}
