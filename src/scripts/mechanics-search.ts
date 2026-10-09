const search = document.querySelector<HTMLInputElement>('#mechanic-search')!;
const filter = document.querySelector<HTMLSelectElement>('#mechanic-section')!;
const families = [
  ...document.querySelectorAll<HTMLDetailsElement>('[data-family]'),
];
export {};
const resultStatus = document.querySelector<HTMLElement>(
  '[data-mechanic-status]',
)!;
const empty = document.querySelector<HTMLElement>('[data-mechanic-empty]')!;
const norm = (s: string) => s.toLocaleLowerCase().replaceAll('ё', 'е');
const initialOpen = new Map(families.map((f) => [f, f.open]));
const totalVariants = families.reduce(
  (n, f) => n + f.querySelectorAll('[data-variant]').length,
  0,
);
const update = () => {
  const tokens = norm(search.value).trim().split(/\s+/).filter(Boolean);
  let familyCount = 0;
  let variantCount = 0;
  for (const family of families) {
    const context = norm(
      `${family.querySelector('[data-family-title]')!.textContent} ${family.querySelector('[data-family-description]')?.textContent ?? ''}`,
    );
    const sectionOK =
      filter.value === 'all' || family.dataset.section === filter.value;
    let matches = 0;
    for (const branch of family.querySelectorAll<HTMLElement>(
      '[data-branch]',
    )) {
      const branchContext = norm(
        branch.querySelector('[data-branch-title]')!.textContent!,
      );
      let branchMatches = 0;
      for (const variant of branch.querySelectorAll<HTMLElement>(
        '[data-variant]',
      )) {
        const text = `${context} ${branchContext} ${norm(variant.textContent!)}`;
        variant.hidden = !sectionOK || !tokens.every((t) => text.includes(t));
        if (!variant.hidden) branchMatches++;
      }
      branch.hidden = branchMatches === 0;
      matches += branchMatches;
    }
    family.hidden = matches === 0;
    if (matches) {
      familyCount++;
      variantCount += matches;
    }
    family.open =
      tokens.length > 0 && matches > 0 ? true : initialOpen.get(family)!;
  }
  for (const section of document.querySelectorAll<HTMLElement>(
    '[data-mechanic-section]',
  )) {
    section.hidden = ![
      ...section.querySelectorAll<HTMLDetailsElement>('[data-family]'),
    ].some((f) => !f.hidden);
  }
  resultStatus.textContent = `${resultStatus.dataset.familiesLabel}: ${familyCount} / ${families.length} · ${resultStatus.dataset.variantsLabel}: ${variantCount} / ${totalVariants}`;
  empty.hidden = familyCount !== 0;
};
document.querySelector<HTMLElement>('.mechanics-controls')!.hidden = false;
search.addEventListener('input', update);
filter.addEventListener('change', update);
document.querySelectorAll('[data-reset]').forEach((b) =>
  b.addEventListener('click', () => {
    search.value = '';
    filter.value = 'all';
    update();
    search.focus();
  }),
);
for (const [selector, open] of [
  ['[data-expand]', true],
  ['[data-collapse]', false],
] as const) {
  document.querySelector(selector)!.addEventListener('click', () =>
    families
      .filter((f) => !f.hidden)
      .forEach((f) => {
        f.open = open;
        initialOpen.set(f, open);
      }),
  );
}
const revealHash = () => {
  let id: string;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  const family = target?.closest<HTMLDetailsElement>('[data-family]');
  if (family) {
    search.value = '';
    filter.value = 'all';
    update();
    family.open = true;
    initialOpen.set(family, true);
    requestAnimationFrame(() => target!.scrollIntoView());
  }
};
window.addEventListener('hashchange', revealHash);
let printState: boolean[];
window.addEventListener('beforeprint', () => {
  printState = families.map((f) => f.open);
  families.filter((f) => !f.hidden).forEach((f) => (f.open = true));
});
window.addEventListener('afterprint', () => {
  families.forEach((f, i) => (f.open = printState[i]));
});
update();
revealHash();
