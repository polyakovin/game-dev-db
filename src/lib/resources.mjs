import resources from '../data/resources.json' with { type: 'json' };
import { orderEntries, orderWithinGroups } from './content-order.mjs';

/** @param {typeof resources[number]} resource */
export function resourceGroup(resource) {
  if (resource.category !== 'design') return 'development';
  if (resource.kind === 'book') return 'books';
  if (resource.format === 'channel') return 'channels';
  if (resource.kind === 'tool') return 'practice';
  if (resource.kind === 'article' || resource.format === 'course')
    return 'research';
  return 'development';
}

export const resourceGroups = orderEntries(
  ['books', 'channels', 'practice', 'research', 'development'].map((id) => ({
    id,
  })),
  'resource-groups',
);

export function getResources() {
  return orderWithinGroups(resources, resourceGroups, resourceGroup, (items) =>
    orderEntries(items, 'resources'),
  );
}
