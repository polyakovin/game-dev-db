import previews from '../data/mechanic-previews.json' with { type: 'json' };

export const mechanicPreviews = previews;

/** Optional authored single-screen presentation, keyed by canonical identity. */
export function getMechanicPreview(id, lang) {
  const entry = previews[id];
  if (!entry) return null;
  return {
    updatedAt: entry.updatedAt,
    title: entry.title?.[lang],
    description: entry.description[lang],
    image: {
      ...entry.image,
      alt: entry.image.alt[lang],
      caption: entry.image.caption[lang],
      markers: entry.image.markers.map((marker) => ({
        ...marker,
        label: marker.label[lang],
      })),
    },
    tips: entry.tips.map((tip) => tip[lang]),
    examples: entry.examples,
  };
}

export const hasMechanicPreview = (id) => Object.hasOwn(previews, id);
