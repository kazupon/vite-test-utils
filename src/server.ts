/**
 * server module, forked from the below:
 * - original repository url: https://github.com/nuxt/framework
 * - npm package name: `@nuxt/test-utils`
 * - code url: https://github.com/nuxt/framework/blob/main/packages/test-utils/src/server.ts
 * - author: Nuxt Framework Team
 * - license: MIT
 */

import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import createDebug from 'debug'
import { getRandomPort, waitForPort } from 'get-port-please'
import { fetch as _fetch, $fetch as _$fetch } from 'ohmyfetch'

import { useTestContext } from './context'

import type { FetchOptions } from 'ohmyfetch'

const DEBUG = createDebug('vite-test-utils:server')

function getServerEntryPoint() {
  const devPath = fileURLToPath(new URL(`./process.${!__BUILD__ ? 'ts' : 'mjs'}`, import.meta.url))
  return devPath
}

/**
 * Start the vite server
 *
 * If `mode` option is `dev`, vite-test-utils will start vite dev server instance.
 *
 * Else `mode` option is `preview`, vite-test-tuils will build your vite test fixture, and start vite preview server instance.
 *
 * Vite dev server and vite preview server is started **with child process**.
 */
export async function startServer() {
  const ctx = useTestContext()

  await stopServer()

  const port = (ctx.port = await getRandomPort())
  ctx.url = `http://localhost:${port}`
  DEBUG(`ctx.url: ${ctx.url}`)

  const devPath = getServerEntryPoint()
  DEBUG('devPath: ', devPath)

  ctx.server = await spawn('jiti', [devPath], {
    cwd: ctx.options.rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      __VTU_PORT: String(port),
      __VTU_MODE: ctx.options.mode,
      __VTU_FIXTURE_BUILD_DIR: ctx.buildDir,
      __VTU_FIXTURE_ROOT: ctx.options.rootDir,
      __VTU_FIXTURE_CONFIG_FILE: ctx.options.configFile,
      __VTU_FIXTURE_VITE_CONFIG: ctx.viteConfigInline,
      __VTU_FIXTURE_VITE_CONFIG_FILE: ctx.options.viteConfigFile,
      NODE_ENV: ctx.options.mode === 'dev' ? 'development' : 'production'
    } as NodeJS.ProcessEnv
  })

  await waitForPort(port, { retries: 32 })
  for (let i = 0; i < 50; i++) {
    await new Promise(resolve => setTimeout(resolve, 100))
    try {
      const res = await _fetch(url('/'))
      DEBUG(`retry ... ${i}`, res.status)
      if (res.status === 200) {
        return
      }
    } catch {} // eslint-disable-line no-empty
  }

  throw new Error('Timeout waiting for dev server!')
}

/**
 * Stop the vite server
 *
 * vite-test-utils will stop vite server instan with {@link startServer}.
 */
export async function stopServer() {
  const ctx = useTestContext()
  if (ctx.server) {
    await ctx.server.kill()
    ctx.server = undefined
    ctx.port = undefined
  }
}

/**
 * The url concatenating function
 *
 * @param {string} path - The path that is concatenated to the url
 * @returns {string} The url with concating the path
 */
export function url(path: string) {
  const ctx = useTestContext()
  if (!ctx.url) {
    throw new Error('url is not available (is `server` option enabled?)')
  }
  return ctx.url + path
}

/**
 * Low level fetch API
 *
 * @remarks
 * This function is delegated with {@link ohmyfetch https://github.com/unjs/ohmyfetch}
 *
 * @param {string} path - The path of fetch request. you can specify a path starting from root (e.g. `/foo`)
 * @param {any} [options] - The options of fetch request, optional
 * @returns {Response} The response of fetch request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetch(path: string, options?: any) {
  return _fetch(url(path), options)
}

type _ResponseType = 'blob' | 'text' | 'arrayBuffer' | 'json'

/**
 * Hight level fetch API
 *
 * @remarks
 * This function is delegated with {@link ohmyfetch https://github.com/unjs/ohmyfetch}
 *
 * @param {string} path - The path of fetch request
 * @param {FetchOptions} [options] - The options of fetch request, optional
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function $fetch<T = any, R extends _ResponseType = 'json'>(
  path: string,
  options?: FetchOptions<R>
): ReturnType<typeof _$fetch<T, R>> {
  return _$fetch<T, R>(url(path), options)
}
