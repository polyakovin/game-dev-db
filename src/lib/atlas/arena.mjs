// Adapted from Boss Fight Atlas by polyakovin and contributors.
// Source revision: 08a279e424d5dd287725e5b3d044187b62267306, lib/encounter-view.mjs.
// Source: https://github.com/polyakovin/gamedev-boss-fights
// Artwork: CC BY 4.0. Implementation: MIT. See /licenses/boss-fight-atlas.txt.
// Changes: self-contained escaping and landscape default dimensions.

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );

/** The atlas stone floor, shared by the mechanic demonstration scenes. */
export function renderEncounterArena(id, { width = 640, height = 480 } = {}) {
  const key = escape(id);
  const stones = Array.from({ length: Math.ceil(height / 68) }, (_, row) =>
    Array.from({ length: Math.ceil(width / 104) }, (_, column) => {
      const x = column * 104 - (row % 2) * 52;
      const y = row * 68;
      return `<rect x="${x + 3}" y="${y + 3}" width="98" height="62" fill="${(row + column) % 3 === 0 ? '#354443' : '#2d3b3b'}" />`;
    }).join(''),
  ).join('');
  return /* HTML */ `<defs>
      <radialGradient id="encounter-light-${key}" cx="50%" cy="43%" r="68%">
        <stop offset="0" stop-color="#203b36" stop-opacity="0" />
        <stop offset="1" stop-color="#071315" stop-opacity=".92" />
      </radialGradient>
      <clipPath id="encounter-floor-${key}"
        ><rect width="${width}" height="${height}"
      /></clipPath>
    </defs>
    <g aria-hidden="true" clip-path="url(#encounter-floor-${key})">
      <rect width="${width}" height="${height}" fill="#263434" />
      <g opacity=".65">${stones}</g>
      <rect
        width="${width}"
        height="${height}"
        fill="url(#encounter-light-${key})"
      />
    </g>`;
}
