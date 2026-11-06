import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import {
  checkPublicRoutes,
  confirmWorkflow,
  githubHeaders,
  main,
} from '../release-pages.mjs';
import { SITE, BASE } from '../../src/lib/site-config.mjs';

const commit = 'a'.repeat(40);
const otherCommit = 'b'.repeat(40);
const run = {
  id: 42,
  head_sha: commit,
  head_branch: 'main',
  event: 'push',
  status: 'completed',
  conclusion: 'success',
  html_url: 'https://github.com/polyakovin/game-dev-db/actions/runs/42',
};
const jobs = ['Verify content and site', 'Deploy GitHub Pages'].map((name) => ({
  name,
  head_sha: commit,
  status: 'completed',
  conclusion: 'success',
}));

function apiFixture({ runs = [run], runJobs = jobs, remote = commit } = {}) {
  return async (path) => {
    if (path.startsWith('/actions/workflows/')) {
      const query = new URL(path, 'https://example.com').searchParams;
      assert.equal(query.get('head_sha'), commit);
      assert.equal(query.get('branch'), 'main');
      assert.equal(query.get('event'), 'push');
      return { workflow_runs: runs };
    }
    if (path.startsWith('/actions/runs/42/jobs')) return { jobs: runJobs };
    if (path === '/git/ref/heads/main') return { object: { sha: remote } };
    assert.fail(`Unexpected API request: ${path}`);
  };
}

const quiet = { commit, log: () => {} };

test('release configuration uses the global main-branch snapshot contract', async () => {
  const config = JSON.parse(
    await readFile(
      new URL('../../.codex/release.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(config.branch, 'main');
  assert.deepEqual(config.command, [
    'node',
    'scripts/release-pages.mjs',
    '--handoff',
  ]);
  assert.ok(config.timeout >= 180 && config.timeout < 1200);
});

test('an existing exact-commit deployment succeeds without dispatching a workflow', async () => {
  assert.equal(
    await confirmWorkflow({ ...quiet, api: apiFixture() }),
    run.html_url,
  );
});

test('waits for the exact commit instead of accepting another successful run', async () => {
  let polls = 0;
  const api = apiFixture();
  let sleeps = 0;
  const workflow = await confirmWorkflow({
    ...quiet,
    api: async (path) => {
      if (path.startsWith('/actions/workflows/') && polls++ === 0) {
        return { workflow_runs: [{ ...run, head_sha: otherCommit }] };
      }
      return api(path);
    },
    sleep: async () => sleeps++,
  });
  assert.equal(workflow, run.html_url);
  assert.equal(sleeps, 1);
});

test('rejects failed, cancelled, skipped and timed-out workflows', async () => {
  for (const conclusion of ['failure', 'cancelled', 'skipped', 'timed_out']) {
    await assert.rejects(
      confirmWorkflow({
        ...quiet,
        api: apiFixture({ runs: [{ ...run, conclusion }] }),
      }),
      new RegExp(`Pages workflow ${conclusion}`),
    );
  }
});

test('requires both successful jobs for this commit even if the run succeeds', async () => {
  for (const runJobs of [
    [jobs[0]],
    [jobs[0], { ...jobs[1], conclusion: 'skipped' }],
    [jobs[0], { ...jobs[1], head_sha: otherCommit }],
  ]) {
    await assert.rejects(
      confirmWorkflow({ ...quiet, api: apiFixture({ runJobs }) }),
      /Required job did not succeed/,
    );
  }
});

test('a newer remote main commit prevents reporting a current release', async () => {
  await assert.rejects(
    confirmWorkflow({ ...quiet, api: apiFixture({ remote: otherCommit }) }),
    /Remote main changed/,
  );
});

test('Stop hands queued publication to CI without waiting for the long browser suite', async () => {
  const api = apiFixture({
    runs: [{ ...run, status: 'queued', conclusion: null }],
  });
  assert.equal(
    await confirmWorkflow({
      ...quiet,
      api,
      handoff: true,
      sleep: async () => assert.fail('A queued release must not wait for CI.'),
    }),
    run.html_url,
  );
});

test('handoff still rejects a failed workflow or a superseded commit', async () => {
  for (const fixture of [
    { runs: [{ ...run, conclusion: 'failure' }] },
    { runs: [{ ...run, status: 'in_progress' }], remote: otherCommit },
  ]) {
    await assert.rejects(
      confirmWorkflow({ ...quiet, api: apiFixture(fixture), handoff: true }),
      /Pages workflow failure|Remote main changed/,
    );
  }
});

test('a missing workflow stops at the deadline', async () => {
  let time = 0;
  await assert.rejects(
    confirmWorkflow({
      ...quiet,
      api: apiFixture({ runs: [] }),
      now: () => time,
      timeout: 30_000,
      sleep: async (ms) => (time += ms),
    }),
    /Timed out/,
  );
  assert.equal(time, 30_000);
});

const root = `${SITE}${BASE}/`;
const publicBodies = {
  'ru/': ['text/html', '<html lang="ru"><body>Каталог</body></html>'],
  'en/': ['text/html', '<html lang="en"><body>Catalog</body></html>'],
  'api/v1/manifest.json': [
    'application/json',
    JSON.stringify({
      schemaVersion: 1,
      languages: ['ru', 'en'],
      endpoints: { discovery: new URL('llms.txt', root).href },
    }),
  ],
  'llms.txt': ['text/plain; charset=utf-8', `# ${SITE}\n`],
};

function publicFixture(overrides = {}) {
  return async (url, options) => {
    assert.ok(url.startsWith(root));
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers?.Authorization, undefined);
    const path = url.slice(root.length);
    const [type, body, status = 200] = overrides[path] ?? publicBodies[path];
    return new Response(body, { status, headers: { 'content-type': type } });
  };
}

test('checks public bilingual pages and exports without API credentials', async () => {
  await checkPublicRoutes(publicFixture());
});

test('an HTTP error, wrong language, foreign manifest or HTML agent index fails', async () => {
  for (const overrides of [
    { 'ru/': ['text/html', 'Unavailable', 503] },
    { 'en/': ['text/html', '<html lang="ru">'] },
    { 'api/v1/manifest.json': ['application/json', '{"schemaVersion":1}'] },
    { 'llms.txt': ['text/html', `<html>${SITE}</html>`] },
  ]) {
    await assert.rejects(
      checkPublicRoutes(publicFixture(overrides)),
      /Production/,
    );
  }
});

test('environment credential stays in the GitHub API header', () => {
  const headers = githubHeaders('/unused', {
    GH_TOKEN: 'test-only-placeholder',
  });
  assert.equal(headers.Authorization, 'Bearer test-only-placeholder');
});

test('rejects invocation without an exact snapshot commit before network access', async () => {
  await assert.rejects(main({}), /global release hook/);
  await assert.rejects(
    main({
      CODEX_RELEASE_COMMIT: 'main',
      CODEX_RELEASE_SOURCE_REPO: '/unused',
    }),
    /global release hook/,
  );
});
