import { searchKnowledge } from '../lib/knowledge-search.mjs';

interface SearchRecord {
  key: string;
  type: string;
  title: string;
  summary: string;
  url: string;
  status: string;
  aliases: string[];
  tags: string[];
  text?: string;
  endsAt: string | null;
}
const root = document.querySelector<HTMLElement>('[data-knowledge-search]')!;
const ru = document.documentElement.lang === 'ru';
const input = root.querySelector<HTMLInputElement>('#knowledge-query')!;
const type = root.querySelector<HTMLSelectElement>('#knowledge-type')!;
const list = root.querySelector<HTMLElement>('[data-knowledge-results]')!;
const status = root.querySelector<HTMLElement>('[data-knowledge-status]')!;
const empty = root.querySelector<HTMLElement>('[data-knowledge-empty]')!;
const more = root.querySelector<HTMLButtonElement>('[data-knowledge-more]')!;
const labels = JSON.parse(root.dataset.typeLabels!) as Record<string, string>;
const params = new URLSearchParams(location.search);
input.value = params.get('q') ?? '';
if ([...type.options].some((option) => option.value === params.get('type')))
  type.value = params.get('type')!;
let records: SearchRecord[] = [];
let limit = 24;
function update() {
  const matches = searchKnowledge(
    records,
    input.value,
    type.value,
  ) as SearchRecord[];
  list.replaceChildren();
  const fragment = document.createDocumentFragment();
  for (const record of matches.slice(0, limit)) {
    const link = document.createElement('a');
    link.className = 'lesson-card';
    const target = new URL(record.url);
    link.href = target.pathname + target.search + target.hash;
    link.dataset.knowledgeResult = record.key;
    const tag = document.createElement('span');
    tag.className = 'category-tag';
    tag.textContent = labels[record.type];
    const title = document.createElement('h2');
    title.textContent = record.title;
    const summary = document.createElement('p');
    summary.textContent = record.summary;
    link.append(tag, title, summary);
    fragment.append(link);
  }
  list.append(fragment);
  status.textContent = `${ru ? 'Найдено' : 'Results'}: ${matches.length} · ${ru ? 'Показано' : 'Shown'}: ${Math.min(matches.length, limit)}`;
  empty.hidden = matches.length !== 0;
  more.hidden = matches.length <= limit;
  const url = new URL(location.href);
  input.value.trim()
    ? url.searchParams.set('q', input.value.trim())
    : url.searchParams.delete('q');
  type.value !== 'all'
    ? url.searchParams.set('type', type.value)
    : url.searchParams.delete('type');
  history.replaceState(null, '', url);
  const alternate = document.querySelector<HTMLAnchorElement>(
    '[data-language-switch]',
  );
  if (alternate) {
    const target = new URL(alternate.href);
    target.search = url.search;
    alternate.href = target.href;
  }
}
for (const control of [input, type])
  control.addEventListener('input', () => {
    limit = 24;
    update();
  });
root.querySelectorAll('[data-knowledge-reset]').forEach((button) =>
  button.addEventListener('click', () => {
    input.value = '';
    type.value = 'all';
    limit = 24;
    update();
    input.focus();
  }),
);
more.addEventListener('click', () => {
  limit += 24;
  update();
});
window.addEventListener('popstate', () => {
  const current = new URLSearchParams(location.search);
  input.value = current.get('q') ?? '';
  type.value = [...type.options].some(
    (option) => option.value === current.get('type'),
  )
    ? current.get('type')!
    : 'all';
  limit = 24;
  update();
});
async function initialize() {
  try {
    const response = await fetch(root.dataset.index!);
    if (!response.ok) throw new Error('Index unavailable');
    records = (await response.json()).records;
    root.querySelector<HTMLElement>('[data-search-controls]')!.hidden = false;
    update();
  } catch {
    status.textContent = ru
      ? 'Поиск временно недоступен. Откройте нужный раздел по ссылкам ниже.'
      : 'Search is temporarily unavailable. Open a section using the links below.';
  }
}
void initialize();
