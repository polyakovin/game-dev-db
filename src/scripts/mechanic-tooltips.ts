const markers = document.querySelectorAll<HTMLButtonElement>('.preview-marker');
let active: { button: HTMLButtonElement; tooltip: HTMLElement } | null = null;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function cancelClose() {
  clearTimeout(closeTimer);
}

function close() {
  cancelClose();
  active?.tooltip.hidePopover();
  active = null;
}

function position() {
  if (!active) return;
  const anchor = active.button.getBoundingClientRect();
  const box = active.tooltip.getBoundingClientRect();
  const margin = 12;
  const left = Math.max(
    margin,
    Math.min(
      anchor.left + anchor.width / 2 - box.width / 2,
      innerWidth - box.width - margin,
    ),
  );
  const above = anchor.top - box.height - 8;
  const top = Math.max(
    margin,
    Math.min(
      above >= margin ? above : anchor.bottom + 8,
      innerHeight - box.height - margin,
    ),
  );
  active.tooltip.style.left = `${left}px`;
  active.tooltip.style.top = `${top}px`;
}

function show(button: HTMLButtonElement, tooltip: HTMLElement) {
  cancelClose();
  if (active?.button !== button) {
    close();
    active = { button, tooltip };
    tooltip.showPopover();
  }
  position();
}

function scheduleClose() {
  cancelClose();
  closeTimer = setTimeout(() => {
    if (!active?.button.matches(':focus-visible')) close();
  }, 120);
}

for (const button of markers) {
  const tooltip = document.getElementById(
    button.getAttribute('aria-describedby')!,
  );
  if (!tooltip || typeof tooltip.showPopover !== 'function') continue;
  // Keep the native title as a no-JavaScript / older-browser fallback only.
  button.removeAttribute('title');
  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') show(button, tooltip);
  });
  button.addEventListener('pointerleave', scheduleClose);
  button.addEventListener('focus', () => {
    if (button.matches(':focus-visible')) show(button, tooltip);
  });
  button.addEventListener('blur', () => {
    if (active?.button === button) close();
  });
  button.addEventListener('click', (event) => {
    if (
      (event as PointerEvent).pointerType === 'touch' &&
      active?.button === button
    )
      close();
    else show(button, tooltip);
  });
  tooltip.addEventListener('pointerenter', cancelClose);
  tooltip.addEventListener('pointerleave', scheduleClose);
}

if (markers.length) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && active) {
      event.preventDefault();
      close();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    const target = event.target as Node;
    if (
      active &&
      !active.button.contains(target) &&
      !active.tooltip.contains(target)
    )
      close();
  });
  window.addEventListener('resize', position);
  document.addEventListener('scroll', close, true);
}
