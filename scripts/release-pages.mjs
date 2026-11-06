import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { SITE, BASE } from '../src/lib/site-config.mjs';

const repository = 'polyakovin/game-dev-db';
const apiRoot = `https://api.github.com/repos/${repository}`;
const requiredJobs = ['Verify content and site', 'Deploy GitHub Pages'];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function githubHeaders(sourceRepo, env = process.env) {
  let token = env.GH_TOKEN || env.GITHUB_TOKEN;
  if (!token) {
    const credential = spawnSync(
      'git',
      ['-C', sourceRepo, 'credential', 'fill'],
      {
        input: `protocol=https\nhost=github.com\npath=${repository}.git\n\n`,
        encoding: 'utf8',
        timeout: 15_000,
        env: { ...env, GIT_TERMINAL_PROMPT: '0' },
      },
    );
    if (credential.status === 0) {
      token = credential.stdout
        .split('\n')
        .find((line) => line.startsWith('password='))
        ?.slice('password='.length);
    }
  }
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2026-03-10',
    'User-Agent': 'gamemechanics-pro-release',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function createApi(headers) {
  return async (path) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetch(`${apiRoot}${path}`, {
        headers,
        redirect: 'error',
        signal: AbortSignal.timeout(20_000),
      });
      if (response.ok) return response.json();
      if (response.status >= 500 && attempt < 2) {
        await pause(2000);
        continue;
      }
      throw new Error(
        `GitHub API returned HTTP ${response.status}. Check API access and rate limits; use GH_TOKEN, GITHUB_TOKEN or the Git credential helper.`,
      );
    }
  };
}

export async function confirmWorkflow({
  commit,
  api,
  sleep = pause,
  now = Date.now,
  timeout = 900_000,
  log = console.log,
  handoff = false,
}) {
  const deadline = now() + timeout;
  let lastStatus;
  while (now() < deadline) {
    const query = new URLSearchParams({
      branch: 'main',
      event: 'push',
      head_sha: commit,
      per_page: '10',
    });
    const data = await api(`/actions/workflows/pages.yml/runs?${query}`);
    const run = data.workflow_runs
      .filter(
        (item) =>
          item.head_sha === commit &&
          item.head_branch === 'main' &&
          item.event === 'push',
      )
      .sort((a, b) => b.id - a.id)[0];
    const status = run
      ? `${run.status}/${run.conclusion ?? 'pending'}`
      : 'waiting for the push workflow';
    if (status !== lastStatus) {
      log(`${commit.slice(0, 12)}: ${status}`);
      lastStatus = status;
    }
    if (run?.status === 'completed') {
      if (run.conclusion !== 'success') {
        throw new Error(`Pages workflow ${run.conclusion}: ${run.html_url}`);
      }
      const { jobs } = await api(`/actions/runs/${run.id}/jobs?per_page=100`);
      for (const name of requiredJobs) {
        if (
          !jobs.some(
            (job) =>
              job.name === name &&
              job.head_sha === commit &&
              job.status === 'completed' &&
              job.conclusion === 'success',
          )
        ) {
          throw new Error(`Required job did not succeed: ${name}`);
        }
      }
      await confirmCurrentCommit(api, commit);
      return run.html_url;
    }
    if (run && handoff) {
      await confirmCurrentCommit(api, commit);
      return run.html_url;
    }
    await sleep(15_000);
  }
  throw new Error(`Timed out waiting for the Pages workflow for ${commit}`);
}

export async function confirmCurrentCommit(api, commit) {
  const current = await api('/git/ref/heads/main');
  if (current.object.sha !== commit) {
    throw new Error(
      'Remote main changed during release; confirm its new commit.',
    );
  }
}

export async function checkPublicRoutes(request = fetch) {
  const root = `${SITE}${BASE}/`;
  for (const path of ['ru/', 'en/', 'api/v1/manifest.json', 'llms.txt']) {
    const url = new URL(path, root).href;
    const response = await request(url, {
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status !== 200) {
      throw new Error(
        `Production route returned HTTP ${response.status}: ${url}`,
      );
    }
    const body = await response.text();
    const contentType = response.headers.get('content-type') ?? '';
    if (path === 'api/v1/manifest.json') {
      const manifest = JSON.parse(body);
      if (
        !contentType.includes('application/json') ||
        manifest.schemaVersion !== 1 ||
        !['ru', 'en'].every((lang) => manifest.languages?.includes(lang)) ||
        manifest.endpoints?.discovery !== new URL('llms.txt', root).href
      ) {
        throw new Error(`Production manifest does not match the site: ${url}`);
      }
    } else if (path === 'llms.txt') {
      if (!contentType.includes('text/plain') || !body.includes(SITE)) {
        throw new Error(`Production agent index is invalid: ${url}`);
      }
    } else {
      const lang = path.slice(0, 2);
      if (
        !contentType.includes('text/html') ||
        !new RegExp(`<html\\b[^>]*\\blang=["']${lang}["']`).test(body)
      ) {
        throw new Error(`Production language page is invalid: ${url}`);
      }
    }
  }
}

export async function main(env = process.env, { handoff = false } = {}) {
  const commit = env.CODEX_RELEASE_COMMIT;
  const sourceRepo = env.CODEX_RELEASE_SOURCE_REPO;
  if (!/^[a-f0-9]{40}$/.test(commit ?? '') || !sourceRepo) {
    throw new Error(
      'Run through the global release hook with CODEX_RELEASE_COMMIT and CODEX_RELEASE_SOURCE_REPO.',
    );
  }
  const api = createApi(githubHeaders(sourceRepo, env));
  const workflow = await confirmWorkflow({
    commit,
    api,
    handoff,
    timeout: handoff ? 120_000 : 4_500_000,
  });
  if (handoff) {
    console.log(
      `Release handed to the verified Pages workflow for ${commit}: ${workflow}. Publication completes only after CI succeeds; run without --handoff to confirm deployment and live routes.`,
    );
    return;
  }
  await checkPublicRoutes();
  await confirmCurrentCommit(api, commit);
  console.log(
    `Released ${commit}: ${workflow}; checked RU/EN, manifest and llms.txt.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.env, { handoff: process.argv.includes('--handoff') }).catch(
    (error) => {
      console.error(`Pages release failed: ${error.message}`);
      process.exitCode = 1;
    },
  );
}
