import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEMO_KINDS,
  demoDuration,
  demoPhaseTimes,
  sampleDemonstration,
} from '../../src/lib/mechanic-demo-model.mjs';

const actor = (frame, id) => frame.actors.find((entry) => entry.id === id);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const near = (a, b, tolerance = 0.001) =>
  assert.ok(Math.abs(a - b) <= tolerance, `${a} differs from ${b}`);

for (const kind of DEMO_KINDS) {
  test(`${kind}: seeking is absolute and nodes stay stable for the complete loop`, () => {
    const start = sampleDemonstration(kind, 0);
    const duration = demoDuration(kind);
    const actorIds = start.actors.map((entry) => entry.id);
    const shapeIds = start.shapes.map((entry) => entry.id);
    assert.equal(new Set(shapeIds).size, shapeIds.length);
    for (let time = 0; time < duration; time += 0.037) {
      const frame = sampleDemonstration(kind, time);
      sampleDemonstration(kind, time / 3);
      assert.deepEqual(sampleDemonstration(kind, time), frame);
      assert.deepEqual(
        frame.actors.map((entry) => entry.id),
        actorIds,
      );
      assert.deepEqual(
        frame.shapes.map((entry) => entry.id),
        shapeIds,
      );
      for (const entry of frame.actors) {
        assert.ok(entry.x > 50 && entry.x < 590);
        assert.ok(entry.y > 100 && entry.y < 440);
        assert.ok(Object.values(entry.motion).every(Number.isFinite));
        assert.ok(entry.motion.stride >= 0 && entry.motion.stride <= 1);
        assert.ok(entry.opacity >= 0 && entry.opacity <= 1);
      }
      for (const entry of frame.shapes) {
        assert.ok(!/NaN|Infinity/.test(entry.d));
        assert.ok(entry.opacity >= 0 && entry.opacity <= 1);
      }
    }
    assert.deepEqual(sampleDemonstration(kind, duration), start);
    assert.deepEqual(sampleDemonstration(kind, NaN), start);
  });

  test(`${kind}: actors return continuously and normal movement remains sufficient`, () => {
    const duration = demoDuration(kind);
    let previous = sampleDemonstration(kind, 0);
    for (let time = 0.01; time < duration + 0.005; time += 0.01) {
      const next = sampleDemonstration(kind, time);
      for (const current of next.actors) {
        const before = actor(previous, current.id);
        const speed = distance(before, current) / 0.01;
        assert.ok(
          speed <= (current.id === 'opponent' ? 350 : 220),
          `${kind} ${current.id} speed ${speed} at ${time}`,
        );
        if (current.id === 'player')
          assert.ok(speed < 215, `ordinary player motion: ${speed}`);
        for (const key of ['crouch', 'lift', 'attack', 'impact', 'dodge']) {
          assert.ok(
            Math.abs(current.motion[key] - before.motion[key]) < 0.2,
            `${kind} ${key} discontinuity at ${time}`,
          );
        }
        assert.ok(
          Math.abs(current.motion.altitude - before.motion.altitude) < 3,
          `${kind} altitude jumps at ${time}`,
        );
      }
      previous = next;
    }
    for (const current of sampleDemonstration(kind, duration - 0.00001)
      .actors) {
      const first = actor(sampleDemonstration(kind, 0), current.id);
      assert.ok(distance(current, first) < 0.001);
      near(current.motion.stride, first.motion.stride);
      // Facing is periodic; a full turn is the same rig pose at the seam.
      near(
        Math.sin((current.facing * Math.PI) / 180),
        Math.sin((first.facing * Math.PI) / 180),
      );
      near(
        Math.cos((current.facing * Math.PI) / 180),
        Math.cos((first.facing * Math.PI) / 180),
      );
    }
  });

  test(`${kind}: phase controls land exactly on their advertised phase`, () => {
    demoPhaseTimes(kind).forEach((time, phase) => {
      assert.equal(sampleDemonstration(kind, time).phase, phase);
    });
  });
}

test('precision jump crosses unsupported space in the air and lands with full footing', () => {
  const kind = 'precision-jump';
  const [, takeoff, touchdown] = demoPhaseTimes(kind);
  const start = sampleDemonstration(kind, takeoff);
  const landed = sampleDemonstration(kind, touchdown);
  const radius = start.geometry.playerRadius;
  assert.ok(actor(start, 'player').x + radius <= start.geometry.left.max);
  assert.equal(landed.geometry.airborne, false);
  assert.equal(landed.geometry.height, 0);
  assert.ok(actor(landed, 'player').x - radius >= landed.geometry.right.min);
  for (let t = 0; t < demoDuration(kind); t += 0.01) {
    const frame = sampleDemonstration(kind, t);
    const { left, right, height } = frame.geometry;
    const x = actor(frame, 'player').x;
    if (x + radius > left.max && x - radius < right.min)
      assert.ok(height > 0, `unsupported at ${t}`);
  }
});

test('parry window includes its start, excludes its end and intercepts the blade', () => {
  const kind = 'timed-parry';
  const start = sampleDemonstration(kind, 0);
  const { opens, closes, contactAt, defenseX } = start.geometry;
  assert.equal(
    sampleDemonstration(kind, opens - 0.000001).geometry.parryActive,
    false,
  );
  assert.equal(sampleDemonstration(kind, opens).geometry.parryActive, true);
  assert.equal(
    sampleDemonstration(kind, closes - 0.000001).geometry.parryActive,
    true,
  );
  assert.equal(sampleDemonstration(kind, closes).geometry.parryActive, false);
  const atContact = sampleDemonstration(kind, contactAt);
  assert.equal(atContact.geometry.parryActive, true);
  assert.equal(atContact.geometry.parried, true);
  near(atContact.geometry.tipX, defenseX);
  for (const t of [contactAt - 0.1, contactAt + 0.1]) {
    assert.ok(sampleDemonstration(kind, t).geometry.tipX > defenseX);
  }
});

test('cover cuts off detection only when it intersects the view ray', () => {
  const sample = (time) => sampleDemonstration('line-of-sight', time);
  assert.equal(sample(0).geometry.detected, true);
  assert.equal(sample(2.2).geometry.detected, false);
  assert.equal(sample(6.8).geometry.detected, true);
  for (let t = 0; t < 8; t += 0.01) {
    const { geometry } = sample(t);
    assert.equal(geometry.inView, true);
    const { crossing, wall } = geometry;
    assert.equal(crossing.x, wall.left);
    const crossesWall = crossing.y >= wall.top && crossing.y <= wall.bottom;
    assert.equal(geometry.detected, !crossesWall);
  }
});

test('retreating does not steer projectiles already in flight or aim when stopped', () => {
  const sample = (time) => sampleDemonstration('independent-aim', time);
  const start = sample(1.6);
  const first = sample(1.8);
  const later = sample(2);
  const stop = sample(4.25);
  const shot = first.geometry.projectiles[0];
  assert.equal(shot.active, true);
  near(shot.x, first.geometry.muzzle.x);
  assert.ok(actor(later, 'player').x < actor(first, 'player').x);
  assert.ok(later.geometry.projectiles[0].x > shot.x);
  assert.equal(later.geometry.projectiles[0].originX, shot.originX);
  assert.equal(sample(shot.hitAt).geometry.projectiles[0].active, false);
  assert.equal(actor(stop, 'player').motion.stride, 0);
  assert.equal(stop.geometry.facing, start.geometry.facing);
});

test('the bridge is fully supported whenever the traveler occupies the gap', () => {
  const sample = (time) => sampleDemonstration('asymmetric-roles', time);
  assert.equal(sample(0).geometry.bridgeOpen, false);
  assert.equal(sample(3.2).geometry.overGap, true);
  assert.equal(sample(7.2).geometry.overGap, true);
  assert.ok(actor(sample(4.6), 'player').x > sample(4.6).geometry.bridge.right);
  assert.equal(sample(10.5).geometry.bridgeOpen, false);
  for (let t = 0; t < 11; t += 0.01) {
    const frame = sample(t);
    if (frame.geometry.overGap) {
      assert.equal(frame.geometry.bridgeOpen, true);
      const partner = actor(frame, 'partner');
      near(distance(partner, frame.geometry.plate), 0);
      assert.equal(partner.motion.stride, 0);
    }
  }
});

test('an unknown kind fails rather than drawing a different mechanic', () => {
  assert.throws(() => sampleDemonstration('missing'), RangeError);
});
