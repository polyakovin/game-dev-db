import { overviewCatalogs } from './mechanic-overviews.mjs';
import directions from '../data/mechanic-directions.json' with { type: 'json' };
import { mechanicCatalogs } from './mechanics.mjs';

export function validateMechanicOverviews(catalogs = overviewCatalogs) {
  const errors = [];
  const definitions = new Set();
  const allCatalogs = new Map(
    mechanicCatalogs.map((catalog) => [catalog.id, catalog]),
  );
  for (const catalog of catalogs) {
    const group = directions.groups.find(
      (item) => item.id === catalog.overviewGroupId,
    );
    if (!group) {
      errors.push(`${catalog.id}: unknown overview group`);
      continue;
    }
    const byId = new Map(catalog.families.map((family) => [family.id, family]));
    for (const direction of group.directions) {
      const standalone = allCatalogs.get(direction.catalogId);
      if (standalone && (!standalone.status || standalone.status === 'active'))
        continue;
      const ref = direction.materialRef;
      const reused = ref && allCatalogs.get(ref.catalogId);
      if (
        reused &&
        !reused.overviewGroupId &&
        (!reused.status || reused.status === 'active') &&
        reused.families.some((family) => family.id === ref.familyId)
      )
        continue;
      const family =
        ref?.catalogId === catalog.id ? byId.get(ref.familyId) : null;
      if (!family) {
        errors.push(`${catalog.id}/${direction.id}: missing overview`);
        continue;
      }
      if (JSON.stringify(family.title) !== JSON.stringify(direction.title))
        errors.push(`${catalog.id}/${family.id}: direction title mismatch`);
      for (const lang of ['ru', 'en']) {
        for (const key of ['description', 'example', 'prototypeCheck']) {
          const text = family[key]?.[lang];
          if (typeof text !== 'string' || text.trim().length < 45)
            errors.push(
              `${catalog.id}/${family.id}: missing substantive ${key}.${lang}`,
            );
        }
        const definition = family.description?.[lang];
        if (definitions.has(definition))
          errors.push(`${catalog.id}/${family.id}: duplicated definition`);
        definitions.add(definition);
        const variants = family.branches
          .flatMap((branch) => branch.variants)
          .map((variant) => variant.text[lang]);
        if (
          variants.length < 4 ||
          new Set(variants).size !== variants.length ||
          variants.some((text) => text.trim().length < 25)
        )
          errors.push(
            `${catalog.id}/${family.id}: four distinct explained ${lang} variants required`,
          );
      }
      if (
        !family.sourceUrls?.length ||
        family.sourceUrls.some(
          (url) => !catalog.sources.some((source) => source.url === url),
        )
      )
        errors.push(
          `${catalog.id}/${family.id}: missing listed source context`,
        );
    }
    for (const family of catalog.families)
      if (!group.directions.some((direction) => direction.id === family.id))
        errors.push(`${catalog.id}/${family.id}: unknown direction`);
  }
  return errors;
}
