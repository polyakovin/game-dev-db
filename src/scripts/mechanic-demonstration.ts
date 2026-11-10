import { createCharacterAnimator } from '../lib/atlas/character-motion.mjs';
import {
  demoDuration,
  sampleDemonstration,
} from '../lib/mechanic-demo-model.mjs';

for (const root of document.querySelectorAll<HTMLElement>(
  '[data-mechanic-demo]',
)) {
  const kind = root.dataset.kind!;
  const ru = root.dataset.lang === 'ru';
  const get = <T extends Element>(selector: string) =>
    root.querySelector<T>(selector)!;
  const toggle = get<HTMLButtonElement>('[data-demo-toggle]');
  const timeline = get<HTMLInputElement>('[data-demo-timeline]');
  const speedControl = get<HTMLSelectElement>('[data-demo-speed]');
  const timeOutput = get<HTMLOutputElement>('[data-demo-time]');
  const explanation = get<HTMLElement>('[data-demo-explanation]');
  const animation = get<HTMLElement>('[data-demo-panel="animation"]');
  const example = get<HTMLElement>('[data-demo-panel="example"]');
  const phaseButtons = [
    ...root.querySelectorAll<HTMLButtonElement>('[data-demo-phase]'),
  ];
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-demo-tab]')];
  const phases: { title: string; description: string }[] = JSON.parse(
    get('[data-demo-copy]').textContent!,
  );
  const duration = demoDuration(kind);
  const actors = new Map(
    sampleDemonstration(kind, 0).actors.map((actor) => {
      const element = get<SVGGElement>(`[data-demo-actor="${actor.id}"]`);
      return [
        actor.id,
        { element, pose: createCharacterAnimator(element, actor.kind) },
      ];
    }),
  );
  const shapes = new Map(
    [...root.querySelectorAll<SVGPathElement>('[data-demo-shape]')].map(
      (element) => [element.dataset.demoShape!, element],
    ),
  );
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let wantsPlayback = !reducedMotion.matches;
  let showingAnimation = true;
  let inView = true;
  let time = 0;
  let speed = 1;
  let raf = 0;
  let lastTick: number | null = null;
  let lastPhase = -1;
  const round = (value: number) => Math.round(value * 1000) / 1000;

  function render() {
    const frame = sampleDemonstration(kind, time);
    for (const actor of frame.actors) {
      const view = actors.get(actor.id)!;
      view.element.setAttribute(
        'transform',
        `translate(${round(actor.x)} ${round(actor.y)})`,
      );
      view.element.setAttribute('opacity', String(round(actor.opacity)));
      view.pose(actor.motion, actor.facing);
    }
    for (const shape of frame.shapes) {
      const view = shapes.get(shape.id)!;
      view.setAttribute('d', shape.d);
      view.setAttribute('opacity', String(round(shape.opacity)));
    }
    root.dataset.time = String(round(time));
    root.dataset.phase = String(frame.phase);
    timeline.value = String(time);
    timeline.setAttribute(
      'aria-valuetext',
      `${time.toFixed(1)} ${ru ? 'из' : 'of'} ${duration.toFixed(1)} ${ru ? 'секунд' : 'seconds'}`,
    );
    timeOutput.value = `${time.toFixed(1)} / ${duration.toFixed(1)}`;
    if (lastPhase !== frame.phase) {
      lastPhase = frame.phase;
      explanation.textContent = phases[frame.phase].description;
      phaseButtons.forEach((button, index) =>
        button.setAttribute('aria-pressed', String(index === frame.phase)),
      );
    }
  }

  function playing() {
    return wantsPlayback && showingAnimation && inView && !document.hidden;
  }

  function tick(now: number) {
    if (!playing()) {
      updatePlayback();
      return;
    }
    if (lastTick !== null)
      time = (time + Math.min((now - lastTick) / 1000, 0.1) * speed) % duration;
    lastTick = now;
    render();
    raf = requestAnimationFrame(tick);
  }

  function updatePlayback() {
    cancelAnimationFrame(raf);
    lastTick = null;
    const active = playing();
    root.dataset.playing = String(active);
    toggle.textContent = active
      ? ru
        ? 'Пауза'
        : 'Pause'
      : ru
        ? 'Играть'
        : 'Play';
    toggle.setAttribute('aria-pressed', String(active));
    // Announce a manually selected explanation, without interrupting reading each loop.
    explanation.setAttribute('aria-live', active ? 'off' : 'polite');
    if (active) raf = requestAnimationFrame(tick);
  }

  function seek(value: number) {
    wantsPlayback = false;
    time = Math.max(0, Math.min(duration, value));
    updatePlayback();
    render();
  }

  function selectTab(tab: HTMLButtonElement) {
    showingAnimation = tab.dataset.demoTab === 'animation';
    animation.hidden = !showingAnimation;
    example.hidden = showingAnimation;
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    }
    updatePlayback();
  }

  toggle.addEventListener('click', () => {
    wantsPlayback = !playing();
    if (time >= duration) time = 0;
    render();
    updatePlayback();
  });
  get('[data-demo-restart]').addEventListener('click', () => {
    time = 0;
    wantsPlayback = !reducedMotion.matches;
    render();
    updatePlayback();
  });
  timeline.addEventListener('input', () => seek(Number(timeline.value)));
  speedControl.addEventListener('change', () => {
    speed = Number(speedControl.value);
  });
  phaseButtons.forEach((button) =>
    button.addEventListener('click', () =>
      seek(Number(button.dataset.phaseTime)),
    ),
  );
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key))
        return;
      event.preventDefault();
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) %
              tabs.length;
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  });
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) wantsPlayback = false;
    updatePlayback();
  });
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(raf);
    lastTick = null;
  });
  window.addEventListener('pageshow', updatePlayback);
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  });
  observer.observe(root);

  animation.setAttribute('role', 'tabpanel');
  animation.setAttribute('aria-labelledby', 'demo-animation-tab');
  example.setAttribute('role', 'tabpanel');
  example.setAttribute('aria-labelledby', 'demo-example-tab');
  example.hidden = true;
  root
    .querySelectorAll<HTMLElement>('[data-demo-controls]')
    .forEach((control) => {
      control.hidden = false;
    });
  render();
  root.dataset.ready = 'true';
  updatePlayback();
}
