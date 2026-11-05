import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { animationLabCopy } from '../lib/animation-lab-copy';
import {
  createDemo,
  disposeModel,
  finiteBounds,
  inPlaceClip,
  rootPositionTargets,
  type LabModel,
} from '../lib/animation-lab-model';
import {
  importLocalModel,
  ModelImportError,
} from '../lib/animation-lab-import';

export function initAnimationLab(root: HTMLElement) {
  const t = animationLabCopy[root.dataset.lang === 'en' ? 'en' : 'ru'];
  const element = <T extends Element>(selector: string) =>
    root.querySelector<T>(selector)!;
  const status = element<HTMLElement>('[data-status]');
  status.hidden = false;
  const app = element<HTMLElement>('[data-app]');
  const retry = element<HTMLAnchorElement>('[data-retry]');
  const canvas = element<HTMLCanvasElement>('[data-canvas]');
  const select = element<HTMLSelectElement>('[data-clips]');
  const timeline = element<HTMLInputElement>('[data-timeline]');
  const play = element<HTMLButtonElement>('[data-play]');
  const record = element<HTMLButtonElement>('[data-record]');
  const background = element<HTMLSelectElement>('[data-background]');
  const download = element<HTMLAnchorElement>('[data-download]');
  const input = (name: string) => element<HTMLInputElement>(`[data-${name}]`);
  const checked = (name: string) => input(name).checked;
  const notify = (message: string, error = false) => {
    status.textContent = message;
    status.dataset.error = String(error);
  };
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
  } catch {
    notify(t.webgl, true);
    retry.hidden = false;
    return;
  }
  renderer.setPixelRatio(1);
  renderer.setSize(540, 960, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 9 / 16, 0.01, 200);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false;
  controls.minDistance = 0.05;
  controls.maxDistance = 100;
  controls.autoRotateSpeed = 0.6;
  const ambient = new THREE.HemisphereLight('#ffffff', '#636e62', 2.5);
  const key = new THREE.DirectionalLight('#fff6e4', 3);
  key.position.set(3, 6, 4);
  const fill = new THREE.DirectionalLight('#ccdeef', 1.3);
  fill.position.set(-4, 3, -3);
  scene.add(ambient, key, fill);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshBasicMaterial({ color: '#e2e0d5' }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.025;
  const grid = new THREE.GridHelper(20, 80, '#aaa99c', '#cecec0');
  grid.position.y = -0.02;
  scene.add(floor, grid);
  let slot = new THREE.Group();
  let model: THREE.Object3D;
  let clips: THREE.AnimationClip[] = [];
  let mixer: THREE.AnimationMixer;
  let action: THREE.AnimationAction | undefined;
  let helper: THREE.SkeletonHelper | undefined;
  let clipIndex = 0;
  let time = 0;
  let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;
  let exporting = false;
  let lost = false;
  let disposed = false;
  let motionRoot: THREE.Object3D | undefined;
  let followOffset = new THREE.Vector3();
  const fitCache = new Map<string, THREE.Box3>();
  const wire = new THREE.MeshBasicMaterial({
    color: '#263d36',
    wireframe: true,
    side: THREE.DoubleSide,
  });
  const originalMaterials = new Map<
    THREE.Mesh,
    THREE.Material | THREE.Material[]
  >();
  let exportUrl: string | undefined;
  let recorder: MediaRecorder | undefined;
  let stream: MediaStream | undefined;
  let recordingTimer: ReturnType<typeof setTimeout> | undefined;
  let recordingFailed = false;
  let recordingError = false;
  let wasPlaying = playing;
  let frameId = 0;
  let lastFrame = performance.now();
  const videoType =
    typeof MediaRecorder !== 'undefined' &&
    typeof canvas.captureStream === 'function'
      ? [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4',
        ].find((mime) => MediaRecorder.isTypeSupported(mime))
      : undefined;
  const videoExtension = videoType?.startsWith('video/mp4') ? 'mp4' : 'webm';
  const alpha = () => background.value === 'transparent';
  const isRecording = () => recorder !== undefined;

  function updateAvailability() {
    const blocked = busy || exporting || lost;
    root
      .querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLButtonElement
      >(
        '.lab-inspector input, .lab-inspector select, .lab-inspector button, .lab-transport input, .lab-transport select, .lab-transport button, .lab-view-actions button',
      )
      .forEach((control) => {
        control.disabled = blocked;
      });
    for (const name of ['loop', 'inplace', 'follow'])
      input(name).disabled = blocked || !clips.length;
    select.disabled = blocked || !clips.length;
    timeline.disabled = blocked || !clips.length;
    play.disabled = blocked || !clips.length;
    root
      .querySelectorAll<HTMLButtonElement>('[data-step]')
      .forEach((button) => {
        button.disabled = blocked || !clips.length;
      });
    element<HTMLSelectElement>('[data-speed]').disabled =
      blocked || !clips.length;
    input('skeleton').disabled = blocked || alpha() || !helper;
    input('grid').disabled = blocked || alpha();
    record.disabled =
      busy || lost || (exporting && !isRecording()) || !videoType || alpha();
    record.textContent = isRecording()
      ? t.stop
      : `${t.record}${videoType ? ` ${videoExtension.toUpperCase()}` : ''}`;
    element<HTMLElement>('[data-video-support]').textContent = !videoType
      ? t.noVideo
      : alpha()
        ? t.alphaVideo
        : `PNG · ${videoExtension.toUpperCase()}`;
    controls.enabled = !blocked;
    play.setAttribute('aria-label', playing ? t.pause : t.play);
    play.textContent = playing ? 'Ⅱ' : '▶';
  }

  function applyScene() {
    const dark = background.value === 'dark';
    renderer.setClearColor(
      dark ? '#1c2928' : background.value === 'green' ? '#00b140' : '#efede4',
      alpha() ? 0 : 1,
    );
    floor.visible = !alpha();
    grid.visible = !alpha() && checked('grid');
    floor.material.color.set(
      dark ? '#1a2424' : background.value === 'green' ? '#00b140' : '#e2e0d5',
    );
    wire.color.set(dark ? '#e2efe5' : '#263d36');
    if (helper) helper.visible = !alpha() && checked('skeleton');
    originalMaterials.forEach((material, mesh) => {
      mesh.material = checked('wireframe') ? wire : material;
    });
    controls.autoRotate = checked('orbit');
    updateAvailability();
    draw();
  }

  function evaluate(at: number) {
    if (!action) return;
    action.time = at;
    action.enabled = true;
    action.paused = true;
    mixer.update(0);
    slot.updateWorldMatrix(true, true);
  }

  function updateFollow() {
    const next = new THREE.Vector3();
    if (checked('follow') && motionRoot) {
      motionRoot.getWorldPosition(next);
      next.y = 0;
    }
    const delta = next.clone().sub(followOffset);
    camera.position.add(delta);
    controls.target.add(delta);
    followOffset.copy(next);
  }

  function syncTime() {
    timeline.value = String(time);
    element<HTMLOutputElement>('[data-time]').textContent =
      `${time.toFixed(2)} / ${(clips[clipIndex]?.duration ?? 0).toFixed(2)} s`;
  }

  function draw() {
    if (disposed || lost) return;
    helper?.updateMatrixWorld(true);
    renderer.render(scene, camera);
  }

  function seek(at: number) {
    time = Math.max(0, Math.min(clips[clipIndex]?.duration ?? 0, at));
    evaluate(time);
    updateFollow();
    syncTime();
    draw();
  }

  function sampledBounds() {
    const cacheKey = `${clipIndex}:${checked('inplace')}:${checked('follow')}`;
    const cached = fitCache.get(cacheKey);
    if (cached) return cached;
    const bounds = new THREE.Box3();
    const duration = clips[clipIndex]?.duration ?? 0;
    const samples = duration ? 24 : 0;
    for (let i = 0; i <= samples; i++) {
      evaluate(samples ? (i / samples) * duration : 0);
      slot.updateWorldMatrix(true, true);
      const pose = new THREE.Box3().setFromObject(slot, true);
      if (
        pose.isEmpty() ||
        ![...pose.min.toArray(), ...pose.max.toArray()].every(Number.isFinite)
      )
        continue;
      if (checked('follow') && motionRoot) {
        const rootPosition = motionRoot.getWorldPosition(new THREE.Vector3());
        rootPosition.y = 0;
        pose.translate(rootPosition.negate());
      }
      bounds.union(pose);
    }
    evaluate(time);
    if (bounds.isEmpty()) bounds.copy(finiteBounds(slot));
    fitCache.set(cacheKey, bounds);
    return bounds;
  }

  function fit() {
    if (!model || lost) return;
    const bounds = sampledBounds();
    const center = bounds.getCenter(new THREE.Vector3());
    let direction = camera.position.clone().sub(controls.target).normalize();
    if (!direction.lengthSq())
      direction = new THREE.Vector3(0.3, 0.08, 1).normalize();
    const right = new THREE.Vector3()
      .crossVectors(camera.up, direction)
      .normalize();
    const up = new THREE.Vector3().crossVectors(direction, right).normalize();
    const tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const tanX = tanY * camera.aspect;
    let distance = 0.1;
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y])
        for (const z of [bounds.min.z, bounds.max.z]) {
          const corner = new THREE.Vector3(x, y, z).sub(center);
          distance = Math.max(
            distance,
            corner.dot(direction) +
              Math.max(
                Math.abs(corner.dot(right)) / tanX,
                Math.abs(corner.dot(up)) / tanY,
              ) *
                1.15,
          );
        }
    followOffset.set(0, 0, 0);
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(direction, distance);
    camera.near = Math.max(0.001, distance / 1000);
    camera.far = Math.max(200, distance * 20);
    camera.updateProjectionMatrix();
    updateFollow();
    controls.update();
    draw();
  }

  function selectClip(preserveTime = false) {
    const previousTime = preserveTime ? time : 0;
    mixer.stopAllAction();
    mixer.uncacheRoot(model);
    const source = clips[clipIndex];
    action = undefined;
    motionRoot = source ? rootPositionTargets(model, source)[0] : undefined;
    if (source) {
      const clip = checked('inplace') ? inPlaceClip(model, source) : source;
      action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      action.paused = true;
    }
    timeline.max = String(source?.duration ?? 1);
    element<HTMLElement>('[data-clip-name]').textContent = source
      ? labelClip(source.name)
      : t.noClips;
    seek(previousTime);
    fit();
    applyScene();
  }

  function labelClip(name: string) {
    return name === 'walk'
      ? t.walk
      : name === 'run'
        ? t.run
        : name === 'idle'
          ? t.idle
          : name || t.clip;
  }

  function replaceModel(next: LabModel, name: string) {
    // Validate before touching the current scene, including actual skinned vertices.
    const nextSlot = new THREE.Group();
    nextSlot.add(next.object);
    let bounds: THREE.Box3;
    try {
      bounds = finiteBounds(nextSlot);
      for (const clip of next.clips) {
        if (
          !clip.validate() ||
          !Number.isFinite(clip.duration) ||
          clip.tracks.some(
            (track) =>
              !track.times.every(Number.isFinite) ||
              !track.values.every(
                (value) => typeof value !== 'number' || Number.isFinite(value),
              ),
          )
        )
          throw new Error('invalid-animation');
        rootPositionTargets(next.object, clip);
      }
    } catch (error) {
      disposeModel(next.object);
      throw error;
    }
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 2.8 / Math.max(size.x, size.y, size.z);
    const center = bounds.getCenter(new THREE.Vector3());
    nextSlot.scale.setScalar(scale);
    nextSlot.position.set(
      -center.x * scale,
      -bounds.min.y * scale,
      -center.z * scale,
    );
    if (model) {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      scene.remove(slot);
      originalMaterials.forEach((material, mesh) => {
        mesh.material = material;
      });
      disposeModel(model);
      if (helper) {
        scene.remove(helper);
        helper.dispose();
      }
    }
    slot = nextSlot;
    model = next.object;
    clips = next.clips.filter(
      (clip) => Number.isFinite(clip.duration) && clip.duration > 0,
    );
    mixer = new THREE.AnimationMixer(model);
    helper = undefined;
    let bones = 0;
    let triangles = 0;
    originalMaterials.clear();
    model.traverse((node) => {
      if (node instanceof THREE.Bone) bones++;
      if (node instanceof THREE.Mesh) {
        originalMaterials.set(node, node.material);
        triangles +=
          (node.geometry.index?.count ??
            node.geometry.attributes.position?.count ??
            0) / 3;
        node.frustumCulled = false;
      }
    });
    scene.add(slot);
    if (bones) {
      helper = new THREE.SkeletonHelper(model);
      for (const material of Array.isArray(helper.material)
        ? helper.material
        : [helper.material]) {
        material.depthTest = false;
        material.transparent = true;
        material.opacity = 0.8;
      }
      scene.add(helper);
    }
    clipIndex = 0;
    time = 0;
    fitCache.clear();
    followOffset.set(0, 0, 0);
    camera.position.set(2, 1.6, 7);
    controls.target.set(0, 1.4, 0);
    select.replaceChildren(
      ...(clips.length
        ? clips.map((clip, i) => new Option(labelClip(clip.name), String(i)))
        : [new Option(t.noClips, '')]),
    );
    element<HTMLElement>('[data-model-name]').textContent = name;
    element<HTMLElement>('[data-stats]').textContent =
      `${t.clips}: ${clips.length} · ${t.bones}: ${bones} · ${t.triangles}: ${Math.round(triangles).toLocaleString(root.dataset.lang)}`;
    selectClip();
    root.dataset.ready = 'true';
    notify(clips.length ? t.modelReady : t.static);
  }

  async function loadFiles(files: File[]) {
    if (busy || exporting || lost) return;
    busy = true;
    updateAvailability();
    notify(t.loading);
    try {
      const next = await importLocalModel(files);
      if (disposed) {
        disposeModel(next.object);
        return;
      }
      replaceModel(next, next.name);
    } catch (error) {
      notify(
        error instanceof ModelImportError ? t[error.reason] : t.badFile,
        true,
      );
    } finally {
      busy = false;
      updateAvailability();
    }
  }

  function showDownload(blob: Blob, extension: string) {
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    exportUrl = URL.createObjectURL(blob);
    download.href = exportUrl;
    download.download = `animation-lab-${Date.now()}.${extension}`;
    download.textContent = `${t.download} · ${extension.toUpperCase()} ↓`;
    download.hidden = false;
  }

  async function savePNG() {
    if (busy || exporting || lost) return;
    exporting = true;
    updateAvailability();
    try {
      renderer.setSize(1080, 1920, false);
      draw();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png'),
      );
      if (!blob || lost) throw new Error('png-export');
      showDownload(blob, 'png');
      notify(t.pngReady);
    } catch {
      notify(t.exportError, true);
    } finally {
      renderer.setSize(540, 960, false);
      exporting = false;
      updateAvailability();
      draw();
    }
  }

  function stopRecording(interrupted = false) {
    if (!recorder) return;
    recordingFailed ||= interrupted;
    clearTimeout(recordingTimer);
    if (recorder.state !== 'inactive') recorder.stop();
  }

  function startRecording() {
    if (isRecording()) {
      stopRecording();
      return;
    }
    if (!videoType || alpha() || busy || exporting || lost) return;
    const durationInput = input('duration');
    const duration = Math.max(
      1,
      Math.min(30, Number(durationInput.value) || 5),
    );
    durationInput.value = String(duration);
    wasPlaying = playing;
    recordingFailed = false;
    recordingError = false;
    exporting = true;
    download.hidden = true;
    try {
      renderer.setSize(1080, 1920, false);
      seek(0);
      playing = true;
      draw();
      stream = canvas.captureStream(30);
      recorder = new MediaRecorder(stream, {
        mimeType: videoType,
        videoBitsPerSecond: 8_000_000,
      });
      const chunks: BlobPart[] = [];
      const current = recorder;
      current.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      current.onerror = () => {
        recordingError = true;
        stopRecording();
      };
      current.onstop = () => {
        stream?.getTracks().forEach((track) => track.stop());
        stream = undefined;
        recorder = undefined;
        exporting = false;
        playing = wasPlaying;
        renderer.setSize(540, 960, false);
        if (!disposed && !recordingFailed && !recordingError && chunks.length) {
          showDownload(
            new Blob(chunks, { type: current.mimeType }),
            videoExtension,
          );
          notify(t.recorded);
        } else if (!disposed)
          notify(
            lost ? t.lost : recordingFailed ? t.interrupted : t.exportError,
            true,
          );
        updateAvailability();
        draw();
      };
      current.start(200);
      lastFrame = performance.now();
      recordingTimer = setTimeout(() => stopRecording(), duration * 1000);
      notify(t.recording);
    } catch {
      stream?.getTracks().forEach((track) => track.stop());
      stream = undefined;
      recorder = undefined;
      exporting = false;
      playing = wasPlaying;
      renderer.setSize(540, 960, false);
      notify(t.exportError, true);
    }
    updateAvailability();
  }

  function togglePlay() {
    if (!clips.length || busy || exporting || lost) return;
    if (!playing && time >= clips[clipIndex].duration) seek(0);
    playing = !playing;
    updateAvailability();
  }
  function step(direction: number) {
    if (!clips.length || busy || exporting || lost) return;
    playing = false;
    seek(time + direction / 30);
    updateAvailability();
  }
  function clean() {
    root.dataset.clean = String(root.dataset.clean !== 'true');
    element<HTMLElement>('.lab-restore').hidden = root.dataset.clean !== 'true';
    // Keep keyboard users inside the visible controls in the modal preview.
    for (const sibling of document.querySelectorAll<HTMLElement>(
      '.sidebar, .topbar, .mobile-nav, .site-footer',
    ))
      sibling.inert = root.dataset.clean === 'true';
    for (const sibling of root.children)
      if (sibling instanceof HTMLElement && sibling !== app)
        sibling.inert = root.dataset.clean === 'true';
    element<HTMLElement>('.lab-inspector').inert =
      root.dataset.clean === 'true';
    element<HTMLElement>('.lab-help').inert = root.dataset.clean === 'true';
    canvas.focus({ preventScroll: true });
  }

  const abort = new AbortController();
  const on = (target: EventTarget, type: string, listener: EventListener) =>
    target.addEventListener(type, listener, { signal: abort.signal });
  on(play, 'click', togglePlay);
  on(timeline, 'input', () => {
    playing = false;
    seek(Number(timeline.value));
    updateAvailability();
  });
  root
    .querySelectorAll<HTMLButtonElement>('[data-step]')
    .forEach((button) =>
      on(button, 'click', () => step(Number(button.dataset.step))),
    );
  root
    .querySelectorAll<HTMLButtonElement>('[data-clean]')
    .forEach((button) => on(button, 'click', clean));
  on(element('[data-fit]'), 'click', fit);
  on(select, 'change', () => {
    clipIndex = Number(select.value);
    selectClip();
  });
  on(input('inplace'), 'change', () => selectClip(true));
  on(input('follow'), 'change', () => {
    fit();
  });
  for (const name of ['skeleton', 'wireframe', 'grid', 'orbit'])
    on(input(name), 'change', applyScene);
  on(background, 'change', applyScene);
  on(element('[data-import]'), 'click', () => input('files').click());
  on(input('files'), 'change', () => {
    const files = [...(input('files').files ?? [])];
    input('files').value = '';
    if (files.length) void loadFiles(files);
  });
  on(element('[data-demo]'), 'click', () => {
    if (!busy && !exporting) replaceModel(createDemo(), t.demo);
  });
  on(element('[data-png]'), 'click', () => {
    void savePNG();
  });
  on(record, 'click', startRecording);
  on(canvas, 'keydown', ((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey || busy || lost) return;
    const key = event.key.toLowerCase();
    if (key === 'r' && isRecording()) {
      event.preventDefault();
      stopRecording();
      return;
    }
    if (exporting) return;
    if ([' ', 'arrowleft', 'arrowright', 'f', 'b', 'w', 'h', 'r'].includes(key))
      event.preventDefault();
    if (key === ' ') togglePlay();
    if (key === 'arrowleft') step(-1);
    if (key === 'arrowright') step(1);
    if (key === 'f') fit();
    if (key === 'h') clean();
    if (key === 'r') startRecording();
    if (key === 'b' || key === 'w') {
      const control = input(key === 'b' ? 'skeleton' : 'wireframe');
      if (!control.disabled) {
        control.checked = !control.checked;
        applyScene();
      }
    }
  }) as EventListener);
  on(document, 'keydown', ((event: KeyboardEvent) => {
    if (event.key === 'Escape' && root.dataset.clean === 'true') clean();
    if (event.key === 'Tab' && root.dataset.clean === 'true') {
      event.preventDefault();
      const restore = element<HTMLButtonElement>('.lab-restore');
      (document.activeElement === canvas ? restore : canvas).focus();
    }
  }) as EventListener);
  const dropZone = element<HTMLElement>('[data-drop-zone]');
  on(dropZone, 'dragover', ((event: DragEvent) => {
    event.preventDefault();
    dropZone.dataset.dragging = 'true';
  }) as EventListener);
  on(dropZone, 'dragleave', () => {
    delete dropZone.dataset.dragging;
  });
  on(dropZone, 'drop', ((event: DragEvent) => {
    event.preventDefault();
    delete dropZone.dataset.dragging;
    void loadFiles([...(event.dataTransfer?.files ?? [])]);
  }) as EventListener);
  on(document, 'visibilitychange', () => {
    lastFrame = performance.now();
    if (document.hidden) stopRecording(true);
  });
  on(canvas, 'webglcontextlost', (event) => {
    event.preventDefault();
    lost = true;
    stopRecording(true);
    updateAvailability();
    notify(t.lost, true);
    retry.hidden = false;
  });

  function animate(now: number) {
    if (disposed) return;
    frameId = requestAnimationFrame(animate);
    const dt = Math.max(0, (now - lastFrame) / 1000);
    lastFrame = now;
    if (document.hidden || lost) return;
    if (playing && action && !busy) {
      const duration = clips[clipIndex].duration;
      const speed = Number(element<HTMLSelectElement>('[data-speed]').value);
      const next = time + dt * speed;
      time = checked('loop') ? next % duration : Math.min(next, duration);
      if (!checked('loop') && next >= duration) {
        playing = false;
        updateAvailability();
      }
      evaluate(time);
      updateFollow();
      syncTime();
    }
    if (controls.enabled || isRecording()) controls.update(dt);
    draw();
  }
  controls.addEventListener('change', draw);
  on(window, 'pagehide', ((event: PageTransitionEvent) => {
    stopRecording(true);
    if (event.persisted) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    clearTimeout(recordingTimer);
    abort.abort();
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    originalMaterials.forEach((material, mesh) => {
      mesh.material = material;
    });
    disposeModel(model);
    helper?.dispose();
    floor.geometry.dispose();
    floor.material.dispose();
    grid.geometry.dispose();
    (grid.material as THREE.Material).dispose();
    wire.dispose();
    controls.dispose();
    renderer.dispose();
  }) as EventListener);
  try {
    replaceModel(createDemo(), t.demo);
    app.hidden = false;
    applyScene();
    notify(t.ready);
    frameId = requestAnimationFrame(animate);
  } catch {
    notify(t.webgl, true);
    retry.hidden = false;
    app.hidden = true;
    renderer.dispose();
  }
}
