const root = document.querySelector<HTMLElement>('[data-practice]')!;
const search = root.querySelector<HTMLInputElement>('#practice-search')!;
const topic = root.querySelector<HTMLSelectElement>('#practice-topic')!;
const duration = root.querySelector<HTMLSelectElement>('#practice-duration')!;
const exercises = [
  ...root.querySelectorAll<HTMLDetailsElement>('[data-exercise]'),
];
const count = root.querySelector<HTMLElement>('[data-practice-count]')!;
const empty = root.querySelector<HTMLElement>('[data-practice-empty]')!;
const normalize = (text: string) =>
  text.toLocaleLowerCase().replaceAll('ё', 'е');
const update = () => {
  const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
  let visible = 0;
  for (const exercise of exercises) {
    exercise.hidden = !(
      words.every((word) =>
        normalize(exercise.dataset.search ?? '').includes(word),
      ) &&
      (!topic.value || exercise.dataset.topic === topic.value) &&
      (!duration.value ||
        Number(exercise.dataset.minutes) <= Number(duration.value))
    );
    if (!exercise.hidden) visible++;
  }
  count.textContent = String(visible).padStart(2, '0');
  empty.hidden = visible !== 0;
};
const reset = () => {
  search.value = '';
  topic.value = '';
  duration.value = '';
  update();
};
root.querySelector<HTMLElement>('.practice-controls')!.hidden = false;
search.addEventListener('input', update);
topic.addEventListener('change', update);
duration.addEventListener('change', update);
root.querySelectorAll('[data-practice-reset]').forEach((button) =>
  button.addEventListener('click', () => {
    reset();
    search.focus();
  }),
);
const languageLink = document.querySelector<HTMLAnchorElement>(
  '[data-language-switch]',
)!;
const alternate = languageLink.getAttribute('href')!;
const revealHash = () => {
  let id: string;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const exercise = exercises.find((item) => item.id === id);
  languageLink.setAttribute(
    'href',
    alternate + (exercise ? `#${exercise.id}` : ''),
  );
  if (exercise) {
    reset();
    exercise.open = true;
    requestAnimationFrame(() => exercise.scrollIntoView());
  }
};
window.addEventListener('hashchange', revealHash);
let printState: boolean[] = [];
window.addEventListener('beforeprint', () => {
  printState = exercises.map((item) => item.open);
  exercises
    .filter((item) => !item.hidden)
    .forEach((item) => (item.open = true));
});
window.addEventListener('afterprint', () =>
  exercises.forEach((item, i) => (item.open = printState[i])),
);
update();
revealHash();
export {};
