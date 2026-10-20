import shared from '../data/mechanic-families.json' with { type: 'json' };
import metadata from '../data/mechanic-catalogs.json' with { type: 'json' };

/** Resolve authored references before ordering, validation or localization. */
export function resolveMechanicCatalog(source, registry = shared) {
  const state = metadata[source.id] ?? { status: 'active', supersededBy: [] };
  return {
    ...source,
    ...state,
    families: source.families.map((placement) => {
      if (placement.ref) {
        if (!registry[placement.ref])
          throw new Error(
            `${source.id}: unknown mechanic reference ${placement.ref}`,
          );
        if (
          Object.keys(placement).some(
            (key) => !['ref', 'id', 'section'].includes(key),
          )
        )
          throw new Error(
            `${source.id}/${placement.id}: shared text must be edited in the registry`,
          );
      }
      const family = placement.ref
        ? {
            ...registry[placement.ref],
            id: placement.id,
            section: placement.section,
          }
        : placement;
      const definition = family.descriptionRef
        ? family.branches
            .flatMap((branch) => branch.variants)
            .find((variant) => variant.id === family.descriptionRef)
        : null;
      if (family.descriptionRef && !definition)
        throw new Error(
          `${source.id}/${family.id}: unknown definition reference ${family.descriptionRef}`,
        );
      return {
        ...family,
        description: definition?.text ?? family.description,
        canonicalId:
          placement.ref ?? family.canonicalId ?? `${source.id}--${family.id}`,
        categoryIds: family.categoryIds ?? [family.section],
      };
    }),
  };
}

export const sharedMechanicFamilies = shared;
