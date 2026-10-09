const search = document.querySelector<HTMLInputElement>('#lens-search')!;
const theme = document.querySelector<HTMLSelectElement>('#lens-theme')!;
const source = document.querySelector<HTMLSelectElement>('#lens-source')!;
const lenses = [
  ...document.querySelectorAll<HTMLDetailsElement>('[data-lens]'),
];
const status = document.querySelector<HTMLElement>('[data-lens-status]')!;
const empty = document.querySelector<HTMLElement>('[data-lens-empty]')!;
const initialOpen = new Map(lenses.map((lens) => [lens, lens.open]));
const normalize = (text: string) =>
  text.normalize('NFC').toLocaleLowerCase().replaceAll('ё', 'е');
export {};
function update() {
  const tokens = normalize(search.value).trim().split(/\s+/).filter(Boolean);
  let count = 0;
  for (const lens of lenses) {
    lens.hidden =
      (theme.value !== 'all' && lens.dataset.theme !== theme.value) ||
      (source.value !== 'all' && lens.dataset.source !== source.value) ||
      !tokens.every((token) => normalize(lens.dataset.search!).includes(token));
    if (!lens.hidden) count++;
    lens.open =
      tokens.length > 0 && !lens.hidden ? true : initialOpen.get(lens)!;
  }
  for (const group of document.querySelectorAll<HTMLElement>(
    '[data-lens-theme-group]',
  )) {
    group.hidden = ![
      ...group.querySelectorAll<HTMLDetailsElement>('[data-lens]'),
    ].some((lens) => !lens.hidden);
  }
  status.textContent = `${status.dataset.label}: ${count} / ${lenses.length}`;
  empty.hidden = count > 0;
}
const reset = () => {
  search.value = '';
  theme.value = source.value = 'all';
  update();
};
search.addEventListener('input', update);
theme.addEventListener('change', update);
source.addEventListener('change', update);
document.querySelectorAll('[data-lens-reset]').forEach((button) =>
  button.addEventListener('click', () => {
    reset();
    search.focus();
  }),
);
for (const [selector, open] of [
  ['[data-lens-expand]', true],
  ['[data-lens-collapse]', false],
] as const) {
  document.querySelector(selector)!.addEventListener('click', () =>
    lenses
      .filter((lens) => !lens.hidden)
      .forEach((lens) => {
        lens.open = open;
        initialOpen.set(lens, open);
      }),
  );
}
function revealHash() {
  let id: string;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const lens = document
    .getElementById(id)
    ?.closest<HTMLDetailsElement>('[data-lens]');
  if (lens) {
    reset();
    lens.open = true;
    initialOpen.set(lens, true);
    requestAnimationFrame(() => lens.scrollIntoView());
  }
}
window.addEventListener('hashchange', revealHash);
let printState: boolean[];
window.addEventListener('beforeprint', () => {
  printState = lenses.map((lens) => lens.open);
  lenses
    .filter((lens) => !lens.hidden)
    .forEach((lens) => {
      lens.open = true;
    });
});
window.addEventListener('afterprint', () =>
  lenses.forEach((lens, index) => {
    lens.open = printState[index];
  }),
);
document.querySelector<HTMLElement>('.lenses-controls')!.hidden = false;
update();
revealHash();
