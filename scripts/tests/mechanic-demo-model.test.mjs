import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEMO_KINDS,
  PLAYER_RADIUS,
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
          speed <= (current.id === 'boss' ? 650 : 220),
          `${kind} ${current.id} speed ${speed} at ${time}`,
        );
        if (current.id === 'player')
          assert.ok(speed < 215, `ordinary player motion: ${speed}`);
        for (const key of [
          'crouch',
          'lift',
          'attack',
          'impact',
          'dodge',
          'altitude',
        ]) {
          assert.ok(
            Math.abs(current.motion[key] - before.motion[key]) < 0.2,
            `${kind} ${key} discontinuity at ${time}`,
          );
        }
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

test('charge tracks before commitment and never steers toward the escaping player afterward', () => {
  assert.notEqual(
    sampleDemonstration('charge', 0).geometry.direction,
    sampleDemonstration('charge', 1).geometry.direction,
  );
  const atLock = sampleDemonstration('charge', 1.2);
  assert.equal(atLock.geometry.locked, true);
  assert.equal(atLock.geometry.active, false);
  for (let time = 1.2; time < 3.15; time += 0.005) {
    const frame = sampleDemonstration('charge', time);
    assert.equal(frame.geometry.direction, atLock.geometry.direction);
    near(actor(frame, 'boss').y, 250);
    if (frame.geometry.active) {
      assert.ok(frame.geometry.clearance > 0);
      assert.ok(
        distance(actor(frame, 'boss'), actor(frame, 'player')) >
          frame.geometry.bossRadius + PLAYER_RADIUS,
      );
    }
  }
  assert.equal(sampleDemonstration('charge', 2.2).geometry.active, true);
  assert.equal(sampleDemonstration('charge', 3.15).geometry.active, false);
  assert.equal(
    actor(sampleDemonstration('charge', 3.5), 'boss').motion.stride,
    0,
  );
});

test('sweep blade shares its angle and reach with the active annular sector', () => {
  const before = sampleDemonstration('sweep', 1);
  assert.equal(before.geometry.active, false);
  assert.ok(before.geometry.innerRadius > 0);
  let previousAngle = -Infinity;
  for (let time = 2; time < 3.8; time += 0.005) {
    const frame = sampleDemonstration('sweep', time);
    assert.ok(frame.geometry.angle >= previousAngle);
    assert.equal(frame.geometry.angle, frame.geometry.weaponAngle);
    assert.ok(
      frame.geometry.clearance > 0,
      'whole player must clear the blade reach',
    );
    assert.ok(
      frame.shapes.find((entry) => entry.id === 'sweep-blade').opacity > 0,
    );
    assert.equal(
      frame.shapes.find((entry) => entry.id === 'sweep-active').role,
      'danger',
    );
    previousAngle = frame.geometry.angle;
  }
  assert.equal(sampleDemonstration('sweep', 3.8).geometry.active, false);
});

test('ground-slam propagation starts at contact and the player clears the final outer radius', () => {
  const contact = sampleDemonstration('ground-slam', 2);
  assert.equal(contact.geometry.radius, 0);
  assert.equal(contact.geometry.active, true);
  assert.deepEqual(contact.geometry.center, {
    x: actor(contact, 'boss').x,
    y: actor(contact, 'boss').y,
  });
  for (let time = 0; time < 4; time += 0.005) {
    const frame = sampleDemonstration('ground-slam', time);
    if (time < 2) {
      assert.equal(frame.geometry.radius, 0);
      assert.equal(frame.geometry.active, false);
    }
    if (frame.geometry.active) {
      assert.ok(frame.geometry.clearance > 0);
      assert.ok(
        distance(actor(frame, 'player'), frame.geometry.center) >
          frame.geometry.maxRadius + PLAYER_RADIUS,
      );
    }
  }
  assert.equal(sampleDemonstration('ground-slam', 3.4).geometry.active, false);
});

test('summon helpers emerge separately, finish their routes and plant their feet', () => {
  assert.ok(actor(sampleDemonstration('summon', 2.4), 'helper-0').opacity > 0);
  assert.equal(
    actor(sampleDemonstration('summon', 2.4), 'helper-1').opacity,
    0,
  );
  for (let time = 2; time < 5.5; time += 0.005) {
    const frame = sampleDemonstration('summon', time);
    for (const helper of frame.geometry.helpers) {
      if (helper.active) assert.ok(helper.clearance > 0);
      if (time >= helper.arriveAt) {
        assert.equal(actor(frame, helper.id).motion.stride, 0);
        assert.ok(actor(frame, helper.id).opacity > 0);
      }
    }
  }
  assert.equal(
    actor(sampleDemonstration('summon', 6.5), 'helper-0').opacity,
    0,
  );
  assert.equal(
    actor(sampleDemonstration('summon', 6.5), 'helper-1').opacity,
    0,
  );
});

test('gap-volley changes the true opening and waits for the final row before returning', () => {
  const variants = new Set();
  for (let time = 0; time < 12; time += 0.005) {
    const frame = sampleDemonstration('gap-volley', time);
    const player = actor(frame, 'player');
    for (const projectile of frame.geometry.projectiles) {
      if (!projectile.active) continue;
      variants.add(projectile.variant);
      assert.notEqual(projectile.x, projectile.gap);
      assert.equal(
        player.x,
        projectile.gap,
        'player arrives before the first row is launched',
      );
      assert.ok(
        distance(player, projectile) > PLAYER_RADIUS + projectile.radius,
      );
    }
    if (time >= 6.7 && time < frame.geometry.returnAt) near(player.x, 410);
    assert.ok(frame.geometry.returnAt > frame.geometry.lastRowEndsAt);
  }
  assert.deepEqual([...variants], [0, 1]);
  assert.equal(sampleDemonstration('gap-volley', 4.5).phase, 1);
  assert.equal(sampleDemonstration('gap-volley', 5).phase, 0);
  assert.equal(sampleDemonstration('gap-volley', 7).phase, 1);
  assert.equal(sampleDemonstration('gap-volley', 9.5).phase, 1);
  assert.equal(sampleDemonstration('gap-volley', 10).phase, 2);
});

test('unknown demonstration IDs fail explicitly', () => {
  assert.throws(() => sampleDemonstration('missing'), RangeError);
  assert.throws(() => demoPhaseTimes('missing'), RangeError);
});
