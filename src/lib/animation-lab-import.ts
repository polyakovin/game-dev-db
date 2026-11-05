import { LoadingManager } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { disposeModel, type LabModel } from './animation-lab-model';

export class ModelImportError extends Error {
  constructor(public reason: 'chooseModel' | 'tooLarge' | 'missingResource') {
    super(reason);
  }
}

export async function importLocalModel(
  files: File[],
): Promise<LabModel & { name: string }> {
  if (files.reduce((sum, file) => sum + file.size, 0) > 100 * 1024 * 1024)
    throw new ModelImportError('tooLarge');
  const models = files.filter((file) => /\.(glb|gltf|fbx)$/i.test(file.name));
  if (models.length !== 1) throw new ModelImportError('chooseModel');
  const model = models[0];
  const urls = new Map<File, string>();
  const manager = new LoadingManager();
  let resourceError = false;
  const missing = (): never => {
    resourceError = true;
    throw new ModelImportError('missingResource');
  };
  const resourcesReady = new Promise<void>((resolve) => {
    manager.onLoad = resolve;
  });
  manager.onError = () => {
    resourceError = true;
  };
  manager.setURLModifier((url) => {
    if (/^(data:|blob:)/i.test(url)) return url;
    // All references, including absolute HTTP URLs, must resolve to selected files.
    // Never let a model initiate a network request for a missing resource.
    if (/^(https?:|\/\/)/i.test(url)) return missing();
    let normalized: string;
    try {
      normalized = decodeURIComponent(url)
        .replace(/\\/g, '/')
        .replace(/^\.\//, '');
    } catch {
      return missing();
    }
    const exact = files.filter(
      (file) => (file.webkitRelativePath || file.name) === normalized,
    );
    const candidates = exact.length
      ? exact
      : files.filter((file) => file.name === normalized.split('/').at(-1));
    if (candidates.length !== 1) return missing();
    const file = candidates[0];
    if (!urls.has(file)) urls.set(file, URL.createObjectURL(file));
    return urls.get(file)!;
  });
  let result: LabModel | undefined;
  manager.itemStart('lab-import');
  let ended = false;
  try {
    const bytes = await model.arrayBuffer();
    if (/\.fbx$/i.test(model.name)) {
      const object = new FBXLoader(manager).parse(bytes, '');
      result = { object, clips: object.animations };
    } else {
      const gltf = await new GLTFLoader(manager).parseAsync(bytes, '');
      result = { object: gltf.scene, clips: gltf.animations };
    }
    ended = true;
    manager.itemEnd('lab-import');
    await resourcesReady;
    if (resourceError) throw new ModelImportError('missingResource');
    return { ...result, name: model.name };
  } catch (error) {
    if (result) disposeModel(result.object);
    throw error;
  } finally {
    if (!ended) manager.itemEnd('lab-import');
    urls.forEach((url) => URL.revokeObjectURL(url));
  }
}
