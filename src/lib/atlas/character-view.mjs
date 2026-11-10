import { CHARACTER_ART } from './character-art.mjs';
import { createCharacterAnimator } from './character-motion.mjs';

/** Apply the browser rig to trusted local artwork for the same no-JS pose. */
export function renderCharacterArt(kind, motion = {}, facing = 0) {
  const art = CHARACTER_ART[kind];
  const attributes = new Map();
  const parts = [
    ...art.matchAll(/<g\b[^>]*data-rig-part="([^"]+)"[^>]*>/g),
  ].map((match) => {
    const name = match[1];
    const changes = new Map();
    attributes.set(name, changes);
    return {
      dataset: { rigPart: name },
      setAttribute: (key, value) => changes.set(key, value),
    };
  });
  createCharacterAnimator({ querySelectorAll: () => parts }, kind)(
    motion,
    facing,
  );
  return art.replace(/<g\b[^>]*data-rig-part="([^"]+)"[^>]*>/g, (tag, name) => {
    for (const [key, value] of attributes.get(name)) {
      const pattern = new RegExp(` ${key}="[^"]*"`);
      tag = pattern.test(tag)
        ? tag.replace(pattern, ` ${key}="${value}"`)
        : tag.replace(/>$/, ` ${key}="${value}">`);
    }
    return tag;
  });
}
