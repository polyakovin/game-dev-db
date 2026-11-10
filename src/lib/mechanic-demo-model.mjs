/** Deterministic ground-plane demonstrations. Positions and radii use SVG units. */
/**
 * @typedef {object} DemoActor
 * @property {string} id
 * @property {string} kind
 * @property {number} x
 * @property {number} y
 * @property {number} facing
 * @property {number} scale
 * @property {number} opacity
 * @property {Record<string, number>} motion
 *
 * @typedef {object} DemoShape
 * @property {string} id
 * @property {string} d
 * @property {string} role
 * @property {number} opacity
 *
 * @typedef {object} DemoFrame
 * @property {string} kind
 * @property {number} time
 * @property {number} duration
 * @property {number} phase
 * @property {DemoActor[]} actors
 * @property {DemoShape[]} shapes
 * @property {Record<string, any>} geometry
 */
export const DEMO_KINDS = Object.freeze([
  'charge',
  'sweep',
  'ground-slam',
  'summon',
  'gap-volley',
]);
export const PLAYER_RADIUS = 26;

const durations = {
  charge: 8,
  sweep: 8,
  'ground-slam': 8,
  summon: 9,
  'gap-volley': 12,
};
const phaseTimes = {
  charge: [0, 2.2, 3.5],
  sweep: [0, 2, 3.8],
  'ground-slam': [0, 2, 3.7],
  summon: [0, 2, 5.5],
  'gap-volley': [0, 2, 10],
};
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const progress = (t, start, end) => clamp((t - start) / (end - start));
const smooth = (p) => p * p * (3 - 2 * p);
const ease = (t, start, end) => smooth(progress(t, start, end));
const mix = (a, b, p) => a + (b - a) * p;
const n = (v) => Math.round(v * 1000) / 1000;
const radians = (a) => (a * Math.PI) / 180;
const point = (x, y, r, a) => ({
  x: x + Math.cos(radians(a)) * r,
  y: y + Math.sin(radians(a)) * r,
});
const xy = (p) => `${n(p.x)} ${n(p.y)}`;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const circle = (x, y, r) =>
  `M ${n(x - r)} ${n(y)} a ${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0 a ${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0`;
const line = (a, b) => `M ${xy(a)} L ${xy(b)}`;
const polygon = (points) =>
  `${points.map((p, i) => `${i ? 'L' : 'M'} ${xy(p)}`).join(' ')} Z`;
const sector = (x, y, inner, outer, start, end) => {
  const a = point(x, y, outer, start);
  const b = point(x, y, outer, end);
  const c = point(x, y, inner, end);
  const d = point(x, y, inner, start);
  return `M ${xy(a)} A ${outer} ${outer} 0 ${end - start > 180 ? 1 : 0} 1 ${xy(b)} L ${xy(c)} A ${inner} ${inner} 0 ${end - start > 180 ? 1 : 0} 0 ${xy(d)} Z`;
};
const fade = (t, start, end, edge = 0.15) =>
  ease(t, start, start + edge) * (1 - ease(t, end - edge, end));
const shape = (id, d, role, opacity = 1) => ({ id, d, role, opacity });

export function demoDuration(kind) {
  if (!DEMO_KINDS.includes(kind))
    throw new RangeError(`Unknown demonstration: ${kind}`);
  return durations[kind];
}

export function demoPhaseTimes(kind) {
  demoDuration(kind);
  return [...phaseTimes[kind]];
}

/** Smooth waypoints provide distance-derived gait and planted feet at arrivals. */
function travel(t, keys, strideScale = 150, gaitLength = 10) {
  let travelled = 0;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    const length = Math.hypot(b[1] - a[1], b[2] - a[2]);
    if (t <= b[0]) {
      const p = progress(t, a[0], b[0]);
      const s = smooth(p);
      const speed = (length * 6 * p * (1 - p)) / (b[0] - a[0]);
      return {
        x: mix(a[1], b[1], s),
        y: mix(a[2], b[2], s),
        facing: mix(a[3] ?? 0, b[3] ?? 0, s),
        motion: {
          gait: (travelled + length * s) / gaitLength,
          stride: clamp(speed / strideScale),
        },
      };
    }
    travelled += length;
  }
  const last = keys.at(-1);
  return {
    x: last[1],
    y: last[2],
    facing: last[3] ?? 0,
    motion: { gait: travelled / gaitLength, stride: 0 },
  };
}

function actor(id, kind, movement, motion = {}, opacity = 1, scale = 0.9) {
  return {
    id,
    kind,
    ...movement,
    scale,
    opacity,
    motion: {
      lean: 0,
      crouch: 0,
      lift: 0,
      attack: 0,
      impact: 0,
      dodge: 0,
      altitude: 0,
      ...movement.motion,
      ...motion,
    },
  };
}

/** @returns {DemoFrame} */
function base(kind, time) {
  const duration = demoDuration(kind);
  const remainder = Number.isFinite(time) ? time % duration : 0;
  // Do not add a duration to positive times: that rounds exact phase boundaries.
  const t = remainder < 0 ? remainder + duration : remainder;
  const [, action, recovery] = phaseTimes[kind];
  return {
    kind,
    time: t,
    duration,
    phase: t < action ? 0 : t < recovery ? 1 : 2,
    actors: [],
    shapes: [],
    geometry: { playerRadius: PLAYER_RADIUS },
  };
}

function charge(frame) {
  const t = frame.time;
  const player = actor(
    'player',
    'tavi',
    travel(t, [
      [0, 360, 225, 180],
      [1, 360, 250, 180],
      [1.2, 360, 250, 180],
      [2.15, 360, 385, 180],
      [5.6, 360, 385, 180],
      [7.6, 360, 225, 180],
      [8, 360, 225, 180],
    ]),
  );
  const boss = actor(
    'boss',
    'kern',
    travel(
      t,
      [
        [0, 120, 250, -6],
        [1.2, 120, 250, 0],
        [2.2, 120, 250, 0],
        [3.15, 515, 250, 0],
        [3.6, 515, 250, 0],
        [4.1, 515, 250, -90],
        [4.8, 515, 145, -90],
        [5.2, 515, 145, -180],
        [6.8, 120, 145, -180],
        [7.1, 120, 145, -270],
        [7.6, 120, 250, -270],
        [8, 120, 250, -366],
      ],
      300,
      17,
    ),
    {
      crouch: ease(t, 0, 1.1) * (1 - ease(t, 2, 2.25)),
      lean: ease(t, 2, 2.25) * (1 - ease(t, 3.15, 3.5)) * 0.8,
      impact: ease(t, 3.05, 3.15) * (1 - ease(t, 3.15, 3.6)) * 0.4,
    },
  );
  const locked = t >= 1.2;
  const direction = locked
    ? 0
    : (Math.atan2(player.y - 250, player.x - 120) * 180) / Math.PI;
  const halfWidth = 43;
  const end = point(120, 250, 395, direction);
  const offset = point(0, 0, halfWidth, direction + 90);
  const corridor = polygon([
    { x: 120 + offset.x, y: 250 + offset.y },
    { x: end.x + offset.x, y: end.y + offset.y },
    { x: end.x - offset.x, y: end.y - offset.y },
    { x: 120 - offset.x, y: 250 - offset.y },
  ]);
  const active = t >= 2.2 && t < 3.15;
  frame.actors = [boss, player];
  frame.shapes = [
    shape('charge-warning', corridor, 'warning', t < 2.2 ? 1 : 0),
    shape('charge-trail', corridor, 'trail', active ? 0.35 : 0),
    shape(
      'charge-body',
      circle(boss.x, boss.y, halfWidth),
      'danger',
      active ? 0.8 : 0,
    ),
    shape(
      'charge-target',
      circle(player.x, locked ? 250 : player.y, 9),
      'warning',
      t < 2.2 ? 1 : 0,
    ),
    shape(
      'charge-response',
      line({ x: 360, y: 250 }, { x: 360, y: 385 }),
      'safe',
      t < 2.2 ? 0.7 : 0,
    ),
  ];
  frame.geometry = {
    ...frame.geometry,
    active,
    locked,
    direction,
    lockAt: 1.2,
    releaseAt: 2.2,
    chargeEnd: 3.15,
    halfWidth,
    bossRadius: halfWidth,
    clearance: Math.abs(player.y - 250) - halfWidth - PLAYER_RADIUS,
  };
}

function sweep(frame) {
  const t = frame.time;
  const pivot = { x: 284, y: 249 };
  const inner = 86;
  const outer = 168;
  const angle =
    t < 2
      ? -55
      : t < 3.8
        ? mix(-55, 75, progress(t, 2, 3.8))
        : mix(75, -55, ease(t, 4.5, 7.4));
  const player = actor(
    'player',
    'tavi',
    travel(t, [
      [0, 408, 300, 180],
      [0.4, 408, 300, 180],
      [1.8, 492, 336, 180],
      [5.7, 492, 336, 180],
      [7.6, 408, 300, 180],
      [8, 408, 300, 180],
    ]),
  );
  const boss = actor(
    'boss',
    'kern',
    travel(t, [
      [0, 245, 275, 0],
      [8, 245, 275, 0],
    ]),
  );
  const shaftA = point(pivot.x, pivot.y, 6, angle + 90);
  const shaftB = point(pivot.x, pivot.y, inner, angle);
  const shaftOffset = point(0, 0, 4, angle + 90);
  const active = t >= 2 && t < 3.8;
  frame.actors = [boss, player];
  frame.shapes = [
    shape(
      'sweep-warning',
      sector(pivot.x, pivot.y, inner, outer, -60, 80),
      'warning',
      t < 2 ? 1 : 0,
    ),
    shape(
      'sweep-active',
      sector(pivot.x, pivot.y, inner, outer, angle - 5, angle + 5),
      'danger',
      active ? 0.85 : 0,
    ),
    shape(
      'sweep-shaft',
      polygon([
        shaftA,
        { x: shaftB.x + shaftOffset.x, y: shaftB.y + shaftOffset.y },
        { x: shaftB.x - shaftOffset.x, y: shaftB.y - shaftOffset.y },
        { x: pivot.x - shaftOffset.x, y: pivot.y - shaftOffset.y },
      ]),
      'weapon',
    ),
    shape(
      'sweep-blade',
      sector(pivot.x, pivot.y, inner, outer, angle - 4, angle + 4),
      'weapon',
    ),
    shape(
      'sweep-response',
      line({ x: 408, y: 300 }, { x: 492, y: 336 }),
      'safe',
      t < 2 ? 0.7 : 0,
    ),
  ];
  frame.geometry = {
    ...frame.geometry,
    active,
    pivot,
    innerRadius: inner,
    outerRadius: outer,
    angle,
    weaponAngle: angle,
    clearance: distance(player, pivot) - outer - PLAYER_RADIUS,
  };
}

function slam(frame) {
  const t = frame.time;
  const center = { x: 240, y: 240 };
  const maxRadius = 135;
  const radius = maxRadius * progress(t, 2, 3.4);
  const ringWidth = 10;
  const active = t >= 2 && t < 3.4;
  const player = actor(
    'player',
    'tavi',
    travel(t, [
      [0, 340, 280, 180],
      [0.35, 340, 280, 180],
      [1.8, 442, 338, 180],
      [5.5, 442, 338, 180],
      [7.6, 340, 280, 180],
      [8, 340, 280, 180],
    ]),
  );
  const boss = actor(
    'boss',
    'kern',
    travel(t, [
      [0, center.x, center.y, 0],
      [8, center.x, center.y, 0],
    ]),
    {
      attack: ease(t, 0.15, 1.4) * (1 - ease(t, 1.8, 2)),
      crouch: ease(t, 1.8, 2) * (1 - ease(t, 2.3, 3.6)),
      impact: ease(t, 1.9, 2) * (1 - ease(t, 2, 2.5)),
    },
  );
  frame.actors = [boss, player];
  frame.shapes = [
    shape(
      'slam-warning',
      circle(center.x, center.y, maxRadius),
      'warning',
      t < 2 ? 1 : 0,
    ),
    shape(
      'slam-ring',
      sector(
        center.x,
        center.y,
        Math.max(0.01, radius - ringWidth),
        Math.max(0.02, radius),
        0,
        359.999,
      ),
      'danger',
      active ? 0.8 : 0,
    ),
    shape(
      'slam-contact',
      circle(center.x, center.y, 25),
      'impact',
      fade(t, 1.99, 2.6, 0.04),
    ),
    shape(
      'slam-response',
      line({ x: 340, y: 280 }, { x: 442, y: 338 }),
      'safe',
      t < 2 ? 0.7 : 0,
    ),
  ];
  frame.geometry = {
    ...frame.geometry,
    active,
    center,
    contactAt: 2,
    radius,
    maxRadius,
    ringWidth,
    clearance: distance(player, center) - radius - PLAYER_RADIUS,
  };
}

function summon(frame) {
  const t = frame.time;
  const boss = actor(
    'boss',
    'kern',
    travel(t, [
      [0, 320, 150, 90],
      [9, 320, 150, 90],
    ]),
    {
      attack: ease(t, 0.1, 1.6) * (1 - ease(t, 3.2, 4.1)),
    },
  );
  const player = actor(
    'player',
    'tavi',
    travel(t, [
      [0, 320, 330, -90],
      [1, 320, 330, -90],
      [2.3, 320, 414, -90],
      [6.6, 320, 414, -90],
      [8.6, 320, 330, -90],
      [9, 320, 330, -90],
    ]),
  );
  const plans = [
    {
      origin: { x: 120, y: 220 },
      target: { x: 278, y: 320 },
      start: 2,
      arrive: 4.2,
      facing: 32,
    },
    {
      origin: { x: 520, y: 220 },
      target: { x: 362, y: 320 },
      start: 2.55,
      arrive: 4.8,
      facing: 148,
    },
  ];
  const helperRadius = 21;
  frame.actors = [boss, player];
  frame.shapes = [];
  const helpers = plans.map((plan, i) => {
    const { origin, target, start, arrive, facing } = plan;
    const helper = actor(
      `helper-${i}`,
      'kern',
      travel(
        t,
        [
          [0, origin.x, origin.y, facing],
          [start + 0.3, origin.x, origin.y, facing],
          [arrive, target.x, target.y, facing],
          [6.4, target.x, target.y, facing],
          [8.6, origin.x, origin.y, facing],
          [9, origin.x, origin.y, facing],
        ],
        110,
        9,
      ),
      {},
      fade(t, start, 6.4, 0.4),
      0.42,
    );
    frame.actors.push(helper);
    frame.shapes.push(
      shape(
        `summon-portal-${i}`,
        circle(origin.x, origin.y, 32),
        'portal',
        t < start + 0.7
          ? 0.65 + 0.35 * ease(t, 0, 1)
          : 1 - ease(t, start + 0.7, start + 1.1),
      ),
      shape(
        `summon-route-${i}`,
        line(origin, target),
        'warning',
        t < start ? 0.7 : 0,
      ),
      shape(
        `summon-threat-${i}`,
        circle(helper.x, helper.y, helperRadius),
        'danger',
        helper.opacity * (t < 5.5 ? 0.6 : 0),
      ),
      shape(
        `summon-dismiss-${i}`,
        circle(target.x, target.y, 28),
        'portal',
        fade(t, 5.5, 6.5, 0.25),
      ),
    );
    return {
      id: helper.id,
      x: helper.x,
      y: helper.y,
      arriveAt: arrive,
      active: t >= start && t < 5.5,
      radius: helperRadius,
      clearance: distance(helper, player) - helperRadius - PLAYER_RADIUS,
    };
  });
  frame.shapes.push(
    shape(
      'summon-response',
      line({ x: 320, y: 330 }, { x: 320, y: 414 }),
      'safe',
      t < 2 ? 0.7 : 0,
    ),
  );
  frame.geometry = { ...frame.geometry, active: t >= 2 && t < 5.5, helpers };
}

function volley(frame) {
  const t = frame.time;
  const lanes = [140, 230, 320, 410, 500];
  const gaps = [230, 410];
  const projectileRadius = 12;
  const player = actor(
    'player',
    'tavi',
    travel(t, [
      [0, 320, 390, -90],
      [0.4, 320, 390, -90],
      [1.7, 230, 390, -90],
      [5.4, 230, 390, -90],
      [6.7, 410, 390, -90],
      [10, 410, 390, -90],
      [11.6, 320, 390, -90],
      [12, 320, 390, -90],
    ]),
  );
  const local = t < 5 ? t : t - 5;
  const boss = actor(
    'boss',
    'kern',
    travel(t, [
      [0, 320, 124, 90],
      [12, 320, 124, 90],
    ]),
    {
      attack: t < 10 ? ease(local, 0.3, 1.8) * (1 - ease(local, 2.6, 3.2)) : 0,
    },
  );
  frame.phase = t >= 10 ? 2 : local < 2 ? 0 : 1;
  frame.actors = [boss, player];
  frame.shapes = [];
  const projectiles = [];
  for (let variant = 0; variant < 2; variant++) {
    const offset = variant * 5;
    const gap = gaps[variant];
    const showing = t >= offset && t < offset + 4.2;
    frame.shapes.push(
      shape(
        `volley-gap-${variant}`,
        polygon([
          { x: gap - 32, y: 172 },
          { x: gap + 32, y: 172 },
          { x: gap + 32, y: 445 },
          { x: gap - 32, y: 445 },
        ]),
        'safe',
        showing ? 0.35 : 0,
      ),
    );
    for (const [lane, x] of lanes.entries()) {
      if (x === gap) continue;
      frame.shapes.push(
        shape(
          `volley-warning-${variant}-${lane}`,
          line({ x, y: 170 }, { x, y: 445 }),
          'warning',
          t >= offset && t < offset + 2 ? 0.7 : 0,
        ),
        shape(
          `volley-source-${variant}-${lane}`,
          circle(x, 170, 16),
          'portal',
          showing ? 0.8 : 0,
        ),
      );
      for (let row = 0; row < 2; row++) {
        const launch = offset + 2 + row * 0.55;
        const end = launch + 1.65;
        const flight = progress(t, launch, end);
        const y =
          t < 10 ? mix(170, 452, flight) : mix(452, 170, ease(t, 10, 11.8));
        const active = t >= launch && t < end;
        const projectile = {
          id: `volley-${variant}-${lane}-${row}`,
          x,
          y,
          radius: projectileRadius,
          active,
          launchAt: launch,
          endAt: end,
          gap,
          variant,
        };
        projectiles.push(projectile);
        frame.shapes.push(
          shape(
            projectile.id,
            polygon([
              { x, y: y - projectileRadius },
              { x: x + projectileRadius, y },
              { x, y: y + projectileRadius },
              { x: x - projectileRadius, y },
            ]),
            'danger',
            fade(t, launch, end, 0.07),
          ),
        );
      }
    }
  }
  frame.geometry = {
    ...frame.geometry,
    active: projectiles.some((p) => p.active),
    gap: gaps[t < 5 ? 0 : 1],
    lanes,
    projectiles,
    returnAt: 10,
    lastRowEndsAt: 9.2,
    clearance: Math.min(
      ...projectiles
        .filter((p) => p.active)
        .map((p) => distance(player, p) - p.radius - PLAYER_RADIUS),
      Infinity,
    ),
  };
}

const models = {
  charge,
  sweep,
  'ground-slam': slam,
  summon,
  'gap-volley': volley,
};

/** @returns {DemoFrame} */
export function sampleDemonstration(kind, time = 0) {
  const frame = base(kind, time);
  models[kind](frame);
  return frame;
}
