import data from '../data/jams.json' with { type: 'json' };
import { currentJams } from './jam-time.mjs';
import { orderEntries } from './content-order.mjs';

export const jamData = data;
export const jamReadTimeRule =
  'Keep only events with Date.parse(endsAt) > current time. startsAt <= current time means open; otherwise upcoming. endsAt is the exclusive submission deadline, not the voting deadline.';

export function jamSnapshot(now = new Date()) {
  return {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    updatedAt: data.updatedAt,
    license: 'CC-BY-4.0',
    attribution: 'Game Dev DB contributors',
    rights:
      'Original editorial summaries are CC BY 4.0. Linked events and their rules retain their owners’ rights.',
    readTimeRule: jamReadTimeRule,
    events: currentJams(data.events, now.getTime()),
    calendars: orderEntries(data.calendars, 'jam-calendars'),
  };
}

/** @param {'ru' | 'en'} lang @param {Date} [now] */
export function getJams(lang, now = new Date()) {
  const snapshot = jamSnapshot(now);
  return {
    ...snapshot,
    events: snapshot.events.map((event) => ({
      ...event,
      title: event.title[lang],
      description: event.description[lang],
      requirements: event.requirements[lang],
    })),
    calendars: snapshot.calendars.map((calendar) => ({
      ...calendar,
      title: calendar.title[lang],
      description: calendar.description[lang],
    })),
  };
}

export function validateJams(value = data) {
  const errors = [];
  const check = (ok, message) => {
    if (!ok) errors.push(`jams: ${message}`);
  };
  const text = (v) => typeof v === 'string' && v.trim().length > 0;
  const date = (v) =>
    typeof v === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    Number.isFinite(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v;
  const instant = (v) =>
    typeof v === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(
      v,
    ) &&
    date(v.slice(0, 10)) &&
    Number.isFinite(Date.parse(v));
  const localized = (v, key) => {
    for (const lang of ['ru', 'en'])
      check(text(v?.[lang]), `${key}: missing ${lang}`);
  };
  check(date(value?.updatedAt), 'invalid updatedAt');
  const ids = new Set();
  const urls = new Set();
  for (const group of ['events', 'calendars']) {
    check(Array.isArray(value?.[group]), `${group} must be an array`);
    for (const item of Array.isArray(value?.[group]) ? value[group] : []) {
      const key = `${group}/${item?.id}`;
      check(
        typeof item?.id === 'string' &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id),
        `${key}: invalid id`,
      );
      check(!ids.has(item?.id), `${key}: duplicate id`);
      ids.add(item?.id);
      let safeUrl = false;
      try {
        const url = new URL(item?.url);
        safeUrl =
          url.protocol === 'https:' &&
          !!url.hostname &&
          !url.username &&
          !url.password;
        check(!urls.has(url.href), `${key}: duplicate URL`);
        urls.add(url.href);
      } catch {
        /* Report the invalid URL below. */
      }
      check(safeUrl, `${key}: URL must be credential-free HTTPS`);
      localized(item?.title, `${key}.title`);
      localized(item?.description, `${key}.description`);
      if (group === 'events') {
        localized(item?.requirements, `${key}.requirements`);
        check(text(item?.organizer), `${key}: organizer required`);
        check(date(item?.verifiedAt), `${key}: invalid verifiedAt`);
        for (const field of ['startsAt', 'endsAt'])
          check(
            instant(item?.[field]),
            `${key}: ${field} must be a valid timestamp with timezone`,
          );
        check(
          Date.parse(item?.endsAt) > Date.parse(item?.startsAt),
          `${key}: deadline must follow start`,
        );
      }
    }
  }
  return errors;
}
