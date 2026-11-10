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
const timings = {
  'precision-jump': { duration: 9, phases: [0, 1.5, 3.15] },
  'timed-parry': { duration: 7, phases: [0, 2.32, 2.58] },
  'line-of-sight': { duration: 8, phases: [0, 2.2, 4.8] },
  'independent-aim': { duration: 8, phases: [0, 1.6, 4.25] },
  'asymmetric-roles': { duration: 11, phases: [0, 2.05, 4.6] },
};
export const DEMO_KINDS = Object.freeze(Object.keys(timings));
const PLAYER_RADIUS = 26;

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const progress = (t, start, end) => clamp((t - start) / (end - start));
const smooth = (p) => p * p * (3 - 2 * p);
const ease = (t, start, end) => smooth(progress(t, start, end));
const mix = (a, b, p) => a + (b - a) * p;
const n = (v) => Math.round(v * 1000) / 1000;
const xy = (p) => `${n(p.x)} ${n(p.y)}`;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const circle = (x, y, r) =>
  `M ${n(x - r)} ${n(y)} a ${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0 a ${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0`;
const line = (a, b) => `M ${xy(a)} L ${xy(b)}`;
const polygon = (points) =>
  `${points.map((p, i) => `${i ? 'L' : 'M'} ${xy(p)}`).join(' ')} Z`;
const rect = (x, y, width, height) =>
  `M ${n(x)} ${n(y)} h ${n(width)} v ${n(height)} h ${n(-width)} Z`;
const arrow = (a, b) => {
  const length = distance(a, b);
  if (!length) return line(a, b);
  const dx = (b.x - a.x) / length;
  const dy = (b.y - a.y) / length;
  const wing = (side) => ({
    x: b.x - 12 * dx - side * 7 * dy,
    y: b.y - 12 * dy + side * 7 * dx,
  });
  return `${line(a, b)} M ${xy(wing(1))} L ${xy(b)} L ${xy(wing(-1))}`;
};
const fade = (t, start, end, edge = 0.15) =>
  ease(t, start, start + edge) * (1 - ease(t, end - edge, end));
const shape = (id, d, role, opacity = 1) => ({ id, d, role, opacity });

export function demoDuration(kind) {
  if (!DEMO_KINDS.includes(kind))
    throw new RangeError(`Unknown demonstration: ${kind}`);
  return timings[kind].duration;
}

export function demoPhaseTimes(kind) {
  demoDuration(kind);
  return [...timings[kind].phases];
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
  const [, action, recovery] = timings[kind].phases;
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

const stand = (x, y, facing) => ({
  x,
  y,
  facing,
  motion: { gait: 0, stride: 0 },
});

function precisionJump(frame) {
  const t = frame.time;
  const ground = 348;
  const takeoff = 212;
  const landing = 402;
  const peak = 116;
  const scale = 1;
  const [, launch, land] = timings['precision-jump'].phases;
  const returning = t >= 5 && t < 6.65;
  const airborne = (t >= launch && t < land) || returning;
  const p = progress(t, returning ? 5 : launch, returning ? 6.65 : land);
  const height = airborne ? 4 * peak * p * (1 - p) : 0;
  let movement;
  if (airborne) {
    movement = stand(
      mix(takeoff, landing, returning ? 1 - p : p),
      ground,
      returning ? 180 : 0,
    );
  } else if (t < launch) {
    movement = travel(t, [
      [0, 124, ground, 0],
      [0.25, 124, ground, 0],
      [launch, takeoff, ground, 0],
    ]);
  } else if (t < 5) {
    movement = travel(t, [
      [land, landing, ground, 0],
      [4.15, landing, ground, 0],
      [4.8, landing, ground, 180],
      [5, landing, ground, 180],
    ]);
  } else {
    movement = travel(t, [
      [6.65, takeoff, ground, 180],
      [8.25, 124, ground, 180],
      [8.8, 124, ground, 0],
      [9, 124, ground, 0],
    ]);
  }
  frame.actors = [
    actor(
      'player',
      'tavi',
      movement,
      {
        altitude: height / scale,
        crouch: airborne ? 0.65 * Math.sin(Math.PI * p) : 0,
        impact:
          ease(t, land, land + 0.08) * (1 - ease(t, land + 0.08, land + 0.35)),
      },
      1,
      scale,
    ),
  ];
  const left = { min: 74, max: 241 };
  const right = { min: 355, max: 563 };
  frame.shapes = [
    shape(
      'jump-pit',
      rect(left.max, ground, right.min - left.max, 480 - ground),
      'void',
    ),
    shape(
      'jump-left',
      rect(left.min, ground, left.max - left.min, 72),
      'surface',
    ),
    shape(
      'jump-right',
      rect(right.min, ground, right.max - right.min, 72),
      'surface',
    ),
    shape(
      'jump-route',
      `M ${takeoff} ${ground} Q ${(takeoff + landing) / 2} ${ground - peak * 2} ${landing} ${ground}`,
      'trail',
      t < land ? 0.8 : 0.2,
    ),
    shape(
      'jump-landing',
      rect(landing - PLAYER_RADIUS, ground - 3, PLAYER_RADIUS * 2, 10),
      'safe',
    ),
    shape(
      'jump-contact',
      circle(landing, ground, 18),
      'impact',
      fade(t, land, land + 0.45),
    ),
  ];
  frame.geometry = {
    ...frame.geometry,
    airborne,
    height,
    takeoff,
    landing,
    left,
    right,
  };
}

function timedParry(frame) {
  const t = frame.time;
  const ground = 310;
  const defenseX = 246;
  const weaponY = 281;
  const reach = 76;
  const gripOffset = 38;
  const [, opens, closes] = timings['timed-parry'].phases;
  const contactAt = 2.45;
  const parryActive = t >= opens && t < closes;
  const parried = contactAt >= opens && contactAt < closes;
  const contactX = defenseX + reach + gripOffset;
  const startX = 417;
  const opponent = travel(t, [
    [0, startX, ground, 180],
    [0.75, startX, ground, 180],
    [1.65, startX + 28, ground, 180],
    [1.95, startX + 28, ground, 180],
    [contactAt, contactX, ground, 180],
    [3.02, startX + 15, ground, 180],
    [4.25, startX + 15, ground, 180],
    [5.4, startX, ground, 180],
    [7, startX, ground, 180],
  ]);
  // The training blade is held straight; its contact point follows the same
  // approach and recoil as the opponent's grip.
  const gripX = opponent.x - gripOffset;
  const tipX = gripX - reach;
  const block =
    ease(t, opens - 0.12, opens) * (1 - ease(t, closes, closes + 0.22));
  const contactFlash =
    t >= contactAt ? 1 - ease(t, contactAt, contactAt + 0.36) : 0;
  frame.actors = [
    actor('opponent', 'kern', opponent, { stride: 0 }),
    actor('player', 'tavi', stand(206, ground, 0), {
      crouch: block * 0.28,
      attack: block * 0.28,
    }),
  ];
  frame.shapes = [
    shape(
      'parry-threat',
      arrow(
        { x: startX - gripOffset, y: weaponY },
        { x: defenseX, y: weaponY },
      ),
      'warning',
      t < contactAt ? 0.9 : 0,
    ),
    shape(
      'parry-plane',
      line({ x: defenseX, y: weaponY - 26 }, { x: defenseX, y: weaponY + 26 }),
      'safe',
      parryActive ? 1 : 0.15,
    ),
    shape(
      'parry-blade',
      polygon([
        { x: tipX, y: weaponY },
        { x: tipX + 14, y: weaponY - 7 },
        { x: gripX, y: weaponY - 6 },
        { x: gripX, y: weaponY + 6 },
        { x: tipX + 14, y: weaponY + 7 },
      ]),
      'weapon',
    ),
    shape(
      'parry-guard',
      rect(defenseX - 9, weaponY - 22, 9, 44),
      'weapon',
      block,
    ),
    shape(
      'parry-contact',
      circle(defenseX, weaponY, 25),
      'impact',
      parried ? contactFlash : 0,
    ),
  ];
  frame.geometry = {
    ...frame.geometry,
    opens,
    closes,
    contactAt,
    defenseX,
    tipX,
    parryActive,
    parried: parried && t >= contactAt,
  };
}

function lineOfSight(frame) {
  const t = frame.time;
  const guard = { x: 121, y: 250 };
  const wall = { left: 277, right: 330, top: 202, bottom: 298 };
  const viewEnd = 552;
  const player = travel(t, [
    [0, 409, 112, 90],
    [0.6, 409, 112, 90],
    [2.2, 409, 250, 90],
    [4.15, 409, 250, 90],
    [4.8, 409, 250, -90],
    [6.75, 409, 112, -90],
    [7.7, 409, 112, 90],
    [8, 409, 112, 90],
  ]);
  const slope = (p) => (p.y - guard.y) / (p.x - guard.x);
  const atX = (p, x) => ({ x, y: guard.y + slope(p) * (x - guard.x) });
  const top = { x: viewEnd, y: 42 };
  const bottom = { x: viewEnd, y: 458 };
  const wallTop = { x: wall.left, y: wall.top };
  const wallBottom = { x: wall.left, y: wall.bottom };
  const crossing = atX(player, wall.left);
  const blocked = crossing.y >= wall.top && crossing.y <= wall.bottom;
  const inView =
    player.x > guard.x &&
    player.x <= viewEnd &&
    slope(player) >= slope(top) &&
    slope(player) <= slope(bottom);
  const detected = inView && !blocked;
  frame.phase = t >= 4.8 ? 2 : detected ? 0 : 1;
  frame.actors = [
    actor('guard', 'kern', stand(guard.x, guard.y, 0)),
    actor('player', 'tavi', player),
  ];
  frame.shapes = [
    shape(
      'sight-field',
      polygon([
        guard,
        top,
        atX(wallTop, viewEnd),
        wallTop,
        wallBottom,
        atX(wallBottom, viewEnd),
        bottom,
      ]),
      'warning',
      0.72,
    ),
    shape(
      'sight-shadow',
      polygon([
        wallTop,
        atX(wallTop, viewEnd),
        atX(wallBottom, viewEnd),
        wallBottom,
      ]),
      'safe',
      0.35,
    ),
    shape(
      'sight-wall',
      rect(wall.left, wall.top, wall.right - wall.left, wall.bottom - wall.top),
      'barrier',
    ),
    shape('sight-ray', line(guard, blocked ? crossing : player), 'trail', 0.85),
    shape(
      'sight-detected',
      circle(player.x, player.y, PLAYER_RADIUS),
      'danger',
      detected ? 0.9 : 0,
    ),
  ];
  frame.geometry = {
    ...frame.geometry,
    guard,
    wall,
    crossing,
    blocked,
    inView,
    detected,
  };
}

function independentAim(frame) {
  const t = frame.time;
  const ground = 288;
  const shotY = ground - 34;
  const playerAt = (time) =>
    travel(time, [
      [0, 325, ground, 0],
      [1.6, 325, ground, 0],
      [4.25, 147, ground, 0],
      [5.35, 147, ground, 0],
      [7.45, 325, ground, 0],
      [8, 325, ground, 0],
    ]);
  const player = playerAt(t);
  const muzzle = { x: player.x + 40, y: shotY };
  const target = { x: 487, y: shotY };
  const shotSpeed = 390;
  const projectiles = [1.8, 2.4, 3.0].map((launch) => {
    const originX = playerAt(launch).x + 40;
    const hitAt = launch + (target.x - originX) / shotSpeed;
    return {
      launch,
      originX,
      hitAt,
      x: clamp(originX + (t - launch) * shotSpeed, originX, target.x),
      active: t >= launch && t < hitAt,
    };
  });
  const hit = Math.max(
    ...projectiles.map((shot) => fade(t, shot.hitAt, shot.hitAt + 0.26, 0.05)),
  );
  frame.actors = [
    actor('opponent', 'kern', stand(515, ground, 180), { impact: hit * 0.5 }),
    actor('player', 'tavi', player, {
      attack: 0.18,
      stride: player.motion.stride * 0.65,
    }),
  ];
  frame.shapes = [
    shape('aim-direction', arrow(muzzle, target), 'trail', 0.65),
    shape(
      'aim-movement',
      arrow(
        { x: player.x, y: ground + 49 },
        { x: player.x - 68, y: ground + 49 },
      ),
      'safe',
      t >= 1.6 && t < 4.25 ? 0.85 : 0,
    ),
    shape('aim-weapon', rect(muzzle.x - 27, muzzle.y - 5, 27, 10), 'weapon'),
    ...projectiles.map((shot, i) =>
      shape(
        `aim-shot-${i}`,
        rect(shot.x - 9, shotY - 4, 18, 8),
        'danger',
        shot.active ? 1 : 0,
      ),
    ),
    shape('aim-hit', circle(target.x, target.y, 19), 'impact', hit),
  ];
  frame.geometry = {
    ...frame.geometry,
    muzzle,
    target,
    projectiles,
    facing: player.facing,
  };
}

function asymmetricRoles(frame) {
  const t = frame.time;
  const bridge = { left: 306, right: 399, y: 223, halfWidth: 34 };
  const plate = { x: 207, y: 354 };
  const partner = travel(t, [
    [0, 111, plate.y, 0],
    [0.35, 111, plate.y, 0],
    [1.9, plate.x, plate.y, 0],
    [8.6, plate.x, plate.y, 0],
    [8.9, plate.x, plate.y, 180],
    [10.5, 111, plate.y, 180],
    [10.9, 111, plate.y, 0],
    [11, 111, plate.y, 0],
  ]);
  const player = travel(t, [
    [0, 235, bridge.y, 0],
    [2.05, 235, bridge.y, 0],
    [4.3, 498, bridge.y, 0],
    [5.45, 498, bridge.y, 0],
    [5.8, 498, bridge.y, 180],
    [8.3, 235, bridge.y, 180],
    [10, 235, bridge.y, 0],
    [11, 235, bridge.y, 0],
  ]);
  const extension = clamp((35 - distance(partner, plate)) / 20);
  const bridgeOpen = extension === 1;
  const overGap =
    player.x + PLAYER_RADIUS > bridge.left &&
    player.x - PLAYER_RADIUS < bridge.right;
  frame.actors = [
    actor('partner', 'kern', partner, { crouch: extension * 0.3 }),
    actor('player', 'tavi', player),
  ];
  frame.shapes = [
    shape(
      'roles-gap',
      rect(bridge.left, 46, bridge.right - bridge.left, 390),
      'void',
    ),
    shape('roles-plate', rect(plate.x - 35, plate.y - 32, 70, 64), 'barrier'),
    shape(
      'roles-plate-held',
      rect(plate.x - 31, plate.y - 28, 62, 56),
      'safe',
      extension,
    ),
    shape(
      'roles-link',
      `M ${plate.x} ${plate.y - 31} V ${bridge.y} H ${bridge.left}`,
      'trail',
      0.36 + extension * 0.55,
    ),
    shape(
      'roles-bridge',
      rect(
        bridge.left,
        bridge.y - bridge.halfWidth,
        (bridge.right - bridge.left) * extension,
        bridge.halfWidth * 2,
      ),
      'surface',
      extension > 0 ? 1 : 0,
    ),
    shape(
      'roles-crossing',
      arrow(
        { x: bridge.left - 24, y: bridge.y },
        { x: bridge.right + 24, y: bridge.y },
      ),
      'safe',
      t < 2.05 ? 0.7 : 0,
    ),
  ];
  frame.geometry = {
    ...frame.geometry,
    bridge,
    plate,
    extension,
    bridgeOpen,
    overGap,
  };
}

const models = {
  'precision-jump': precisionJump,
  'timed-parry': timedParry,
  'line-of-sight': lineOfSight,
  'independent-aim': independentAim,
  'asymmetric-roles': asymmetricRoles,
};

/** @returns {DemoFrame} */
export function sampleDemonstration(kind, time = 0) {
  const frame = base(kind, time);
  models[kind](frame);
  return frame;
}
