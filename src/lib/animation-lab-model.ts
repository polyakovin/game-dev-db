import * as THREE from 'three';

export interface LabModel {
  object: THREE.Object3D;
  clips: THREE.AnimationClip[];
}

// Original demo geometry and motion. No downloaded models or animation data.
export function createDemo(): LabModel {
  const object = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({
    color: '#8faaa0',
    roughness: 0.65,
    metalness: 0.15,
  });
  const joint = new THREE.MeshStandardMaterial({
    color: '#354943',
    roughness: 0.8,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: '#dc784b',
    roughness: 0.6,
  });
  const visor = new THREE.MeshStandardMaterial({
    color: '#172b2a',
    roughness: 0.3,
  });
  const eye = new THREE.MeshBasicMaterial({ color: '#e8f7cc' });
  function bone(
    name: string,
    parent: THREE.Object3D,
    x: number,
    y: number,
    z = 0,
  ) {
    const node = new THREE.Bone();
    node.name = name;
    node.position.set(x, y, z);
    parent.add(node);
    return node;
  }
  function part(
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  const hips = bone('Hips', object, 0, 1.18);
  part(hips, new THREE.BoxGeometry(0.52, 0.28, 0.32), joint);
  const spine = bone('Spine', hips, 0, 0.2);
  part(spine, new THREE.CapsuleGeometry(0.31, 0.31, 5, 12), body, 0, 0.28);
  part(spine, new THREE.BoxGeometry(0.25, 0.06, 0.06), orange, 0, 0.4, 0.3);
  const head = bone('Head', spine, 0, 0.88);
  part(head, new THREE.SphereGeometry(0.3, 20, 14), body);
  const face = part(
    head,
    new THREE.SphereGeometry(0.235, 16, 10),
    visor,
    0,
    0,
    0.14,
  );
  face.scale.set(1, 0.55, 0.7);
  for (const x of [-0.085, 0.085])
    part(head, new THREE.SphereGeometry(0.033, 8, 6), eye, x, 0.01, 0.295);
  for (const side of [-1, 1]) {
    const prefix = side < 0 ? 'Left' : 'Right';
    const arm = bone(`${prefix}Arm`, spine, side * 0.43, 0.48);
    part(arm, new THREE.SphereGeometry(0.13, 10, 8), orange);
    part(arm, new THREE.CapsuleGeometry(0.095, 0.29, 4, 10), body, 0, -0.23);
    const elbow = bone(`${prefix}Forearm`, arm, 0, -0.48);
    part(elbow, new THREE.SphereGeometry(0.1, 10, 8), joint);
    part(elbow, new THREE.CapsuleGeometry(0.085, 0.23, 4, 10), body, 0, -0.2);
    const hand = bone(`${prefix}Hand`, elbow, 0, -0.4);
    part(hand, new THREE.SphereGeometry(0.105, 10, 8), joint);
    const leg = bone(`${prefix}Leg`, hips, side * 0.19, -0.08);
    part(leg, new THREE.CapsuleGeometry(0.12, 0.28, 4, 10), body, 0, -0.25);
    const knee = bone(`${prefix}Shin`, leg, 0, -0.5);
    part(knee, new THREE.SphereGeometry(0.12, 10, 8), orange);
    part(knee, new THREE.CapsuleGeometry(0.09, 0.28, 4, 10), body, 0, -0.23);
    const foot = bone(`${prefix}Foot`, knee, 0, -0.47);
    part(foot, new THREE.BoxGeometry(0.25, 0.14, 0.38), joint, 0, -0.04, 0.08);
  }
  const clips = ['walk', 'run', 'idle'].map((name) => {
    const duration = name === 'run' ? 0.7 : name === 'walk' ? 1.4 : 3;
    const times = Array.from({ length: 33 }, (_, i) => (i * duration) / 32);
    const tracks: THREE.KeyframeTrack[] = [];
    const positions = times.flatMap((time) => {
      const phase = (time / duration) * Math.PI * 2;
      return [
        0,
        1.18 + (name === 'idle' ? 0.015 : 0.045) * (1 - Math.cos(phase * 2)),
        name === 'idle' ? 0 : (time / duration) * 1.6,
      ];
    });
    tracks.push(
      new THREE.VectorKeyframeTrack('Hips.position', times, positions),
    );
    for (const side of [-1, 1]) {
      const prefix = side < 0 ? 'Left' : 'Right';
      for (const limb of ['Arm', 'Forearm', 'Leg', 'Shin']) {
        const values = times.flatMap((time) => {
          const phase =
            (time / duration) * Math.PI * 2 + (side < 0 ? Math.PI : 0);
          let angle = 0;
          const stride = name === 'run' ? 0.9 : name === 'walk' ? 0.48 : 0.04;
          if (limb === 'Leg') angle = Math.sin(phase) * stride;
          if (limb === 'Arm') angle = -Math.sin(phase) * stride * 0.7;
          if (limb === 'Shin')
            angle = Math.max(0, -Math.sin(phase)) * stride * 1.5;
          if (limb === 'Forearm') angle = -0.25 - (name === 'run' ? 0.75 : 0);
          return new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(angle, 0, 0))
            .toArray();
        });
        tracks.push(
          new THREE.QuaternionKeyframeTrack(
            `${prefix}${limb}.quaternion`,
            times,
            values,
          ),
        );
      }
    }
    return new THREE.AnimationClip(name, duration, tracks);
  });
  return { object, clips };
}

export function disposeModel(object: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const skeletons = new Set<THREE.Skeleton>();
  object.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    geometries.add(node.geometry);
    for (const material of Array.isArray(node.material)
      ? node.material
      : [node.material]) {
      materials.add(material);
      for (const value of Object.values(material))
        if (value instanceof THREE.Texture) textures.add(value);
    }
    if (node instanceof THREE.SkinnedMesh) skeletons.add(node.skeleton);
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => {
    texture.dispose();
    const data = texture.source.data;
    if (typeof ImageBitmap !== 'undefined' && data instanceof ImageBitmap)
      data.close();
  });
  skeletons.forEach((skeleton) => skeleton.dispose());
}

export function positionTarget(
  object: THREE.Object3D,
  track: THREE.KeyframeTrack,
) {
  const parsed = THREE.PropertyBinding.parseTrackName(track.name);
  if (parsed.propertyName !== 'position') return null;
  let target = THREE.PropertyBinding.findNode(
    object,
    parsed.nodeName,
  ) as THREE.Object3D | null;
  if (parsed.objectName === 'bones' && target instanceof THREE.SkinnedMesh) {
    target = target.skeleton.getBoneByName(String(parsed.objectIndex)) ?? null;
  }
  return target;
}

export function rootPositionTargets(
  object: THREE.Object3D,
  clip: THREE.AnimationClip,
) {
  const nodes = new Set(
    clip.tracks
      .map((track) => positionTarget(object, track))
      .filter((node): node is THREE.Object3D => Boolean(node)),
  );
  return [...nodes].filter((node) => {
    for (let parent = node.parent; parent; parent = parent.parent)
      if (nodes.has(parent)) return false;
    return true;
  });
}

export function inPlaceClip(object: THREE.Object3D, clip: THREE.AnimationClip) {
  const roots = new Set(rootPositionTargets(object, clip));
  const clone = clip.clone();
  clone.tracks.forEach((track) => {
    const target = positionTarget(object, track);
    if (!target || !roots.has(target)) return;
    const stride = track.getValueSize();
    if (stride !== 3 && stride !== 9) return;
    const valueOffset = stride === 9 ? 3 : 0;
    const x = track.values[valueOffset];
    const z = track.values[valueOffset + 2];
    for (let i = 0; i < track.values.length; i += stride) {
      track.values[i + valueOffset] = x;
      track.values[i + valueOffset + 2] = z;
      if (stride === 9) {
        track.values[i] = track.values[i + 2] = 0;
        track.values[i + 6] = track.values[i + 8] = 0;
      }
    }
  });
  return clone;
}

export function finiteBounds(object: THREE.Object3D) {
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(object, true);
  const values = [...box.min.toArray(), ...box.max.toArray()];
  if (
    box.isEmpty() ||
    !values.every(Number.isFinite) ||
    box.getSize(new THREE.Vector3()).length() <= 1e-8
  )
    throw new Error('empty-model');
  return box;
}
