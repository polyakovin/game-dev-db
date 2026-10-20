import data from '../data/mechanic-directions.json' with { type: 'json' };
import { getMechanics } from './mechanics.mjs';
import { absolute } from './site.ts';

export const mechanicDirectionData = data;

/** @param {unknown} source */
export function validateMechanicDirections(source) {
  const errors = [];
  if (!source || typeof source !== 'object')
    return ['Direction data is missing'];
  const value = /** @type {typeof data} */ (source);
  if (value.schemaVersion !== 1)
    errors.push('Invalid direction schema version');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.updatedAt ?? ''))
    errors.push('Missing direction update date');
  if (!Array.isArray(value.groups) || !value.groups.length)
    return [...errors, 'Direction groups are missing'];
  const ids = new Set();
  const catalogIds = new Set();
  const localized = (text, location) => {
    for (const lang of ['ru', 'en'])
      if (typeof text?.[lang] !== 'string' || !text[lang].trim())
        errors.push(`${location}: missing ${lang} title`);
  };
  const identity = (id, location) => {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id) || ids.has(id))
      errors.push(`${location}: invalid or duplicate identity`);
    ids.add(id);
  };
  for (const group of value.groups) {
    identity(group?.id, 'group');
    localized(group?.title, group?.id);
    if (!Array.isArray(group?.directions) || !group.directions.length) {
      errors.push(`${group?.id}: directions are missing`);
      continue;
    }
    for (const direction of group.directions) {
      identity(direction?.id, group.id);
      localized(direction?.title, direction?.id);
      if (
        typeof direction?.catalogId !== 'string' ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(direction.catalogId) ||
        catalogIds.has(direction.catalogId)
      )
        errors.push(`${direction?.id}: invalid or duplicate catalog ID`);
      catalogIds.add(direction?.catalogId);
      if ('materialRef' in direction && direction.materialRef !== undefined) {
        const ref = /** @type {{catalogId?: string, familyId?: string}} */ (
          direction.materialRef
        );
        for (const key of ['catalogId', 'familyId'])
          if (
            typeof ref?.[key] !== 'string' ||
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(ref[key])
          )
            errors.push(`${direction.id}: invalid materialRef.${key}`);
      }
    }
  }
  return errors;
}

const errors = validateMechanicDirections(data);
if (errors.length) throw new Error(errors.join('\n'));

/**
 * @param {'ru' | 'en'} lang
 * @param {(ReturnType<typeof getMechanics>[number] & { status?: string })[]} [catalogs]
 */
export function getMechanicDirections(lang, catalogs = getMechanics(lang)) {
  const active = catalogs.filter(
    (catalog) => !catalog.status || catalog.status === 'active',
  );
  const byId = new Map(active.map((catalog) => [catalog.id, catalog]));
  const represented = new Set();
  const groups = data.groups.map((group) => ({
    id: group.id,
    title: group.title[lang],
    directions: group.directions.map((direction) => {
      represented.add(direction.catalogId);
      const reference =
        /** @type {{materialRef?: {catalogId: string, familyId: string}}} */ (
          direction
        ).materialRef;
      const standalone = byId.get(direction.catalogId);
      const parent = reference ? byId.get(reference.catalogId) : undefined;
      const family = parent?.families.find(
        (item) => item.id === reference?.familyId,
      );
      const catalog = standalone ?? (family ? parent : undefined);
      const targeted = !standalone && family;
      if (catalog) represented.add(catalog.id);
      return {
        id: direction.id,
        catalogId: direction.catalogId,
        title: direction.title[lang],
        status: catalog ? 'ready' : 'in-development',
        url: catalog
          ? `${catalog.url}${targeted ? `#${family.id}` : ''}`
          : null,
        materialRef: targeted
          ? { catalogId: catalog.id, familyId: family.id }
          : null,
        description: targeted
          ? family.description
          : (catalog?.description ?? ''),
        counts: targeted
          ? {
              families: 1,
              branches: family.branches.length,
              variants: family.branches.reduce(
                (total, branch) => total + branch.variants.length,
                0,
              ),
            }
          : (catalog?.counts ?? null),
        searchText: [
          ...Object.values(group.title),
          ...Object.values(direction.title),
          catalog?.title ?? '',
          targeted ? family.description : (catalog?.description ?? ''),
        ].join(' '),
      };
    }),
  }));
  const additionalCatalogs = active
    .filter((catalog) => !represented.has(catalog.id))
    .map((catalog) => ({
      id: `catalog-${catalog.id}`,
      catalogId: catalog.id,
      title: catalog.title,
      status: 'ready',
      materialRef: null,
      url: catalog.url,
      description: catalog.description,
      counts: catalog.counts,
      searchText: `${catalog.title} ${catalog.description}`,
    }));
  const directions = groups.flatMap((group) => group.directions);
  const readyDirections = directions.filter((d) => d.status === 'ready').length;
  return {
    lang,
    updatedAt: data.updatedAt,
    url: absolute(`${lang}/mechanics/`),
    groups,
    additionalCatalogs,
    counts: {
      groups: groups.length,
      directions: directions.length,
      readyDirections,
      readyMaterials: readyDirections + additionalCatalogs.length,
      inDevelopment: directions.length - readyDirections,
      entries: directions.length + additionalCatalogs.length,
    },
  };
}

/** Validate authored overview targets without changing pure discovery behavior. */
export function validateDirectionMaterials(catalogs = getMechanics('ru')) {
  const errors = [];
  const byId = new Map(catalogs.map((catalog) => [catalog.id, catalog]));
  for (const direction of data.groups.flatMap((group) => group.directions)) {
    const reference =
      /** @type {{materialRef?: {catalogId: string, familyId: string}}} */ (
        direction
      ).materialRef;
    if (!reference) continue;
    const catalog = byId.get(reference.catalogId);
    const family = catalog?.families.find(
      (item) => item.id === reference.familyId,
    );
    if (!catalog || (catalog.status && catalog.status !== 'active') || !family)
      errors.push(`${direction.id}: missing active overview target`);
    else if (
      family.branches.reduce((n, branch) => n + branch.variants.length, 0) < 4
    )
      errors.push(`${direction.id}: overview needs four concrete variants`);
  }
  return errors;
}

export function mechanicDirectionRecords() {
  return ['ru', 'en'].map((lang) =>
    getMechanicDirections(/** @type {'ru' | 'en'} */ (lang)),
  );
}
