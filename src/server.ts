/**
 * server module, forked from the below:
 * - original repository url: https://github.com/nuxt/framework
 * - npm package name: `@nuxt/test-utils`
 * - code url: https://github.com/nuxt/framework/blob/main/packages/test-utils/src/server.ts
 * - author: Nuxt Framework Team
 * - license: MIT
 */

import { fileURLToPath } from 'node:url'
import { fetch as _fetch, $fetch as _$fetch } from 'ohmyfetch'
import { getRandomPort, waitForPort } from 'get-port-please'
import { useTestContext } from './context'
import { execa } from 'execa'
import createDebug from 'debug'

import type { FetchOptions } from 'ohmyfetch'

const DEBUG = createDebug('vite-test-utils:server')

export async function startServer() {
  const ctx = useTestContext()

  await stopServer()

  const port = (ctx.port = await getRandomPort())
  ctx.url = `http://localhost:${port}`
  DEBUG(`ctx.url: ${ctx.url}`)

  const devPath = fileURLToPath(new URL(`../lib/dev.ts`, import.meta.url))
  DEBUG('devPath: ', devPath)

  ctx.server = execa('jiti', [devPath], {
    cwd: ctx.options.rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_TEST_UTILS_PORT: String(port),
      VITE_TEST_UTILS_CONFIG: ctx.viteConfig,
      NODE_ENV: 'development'
    }
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
    throw new Error('url is not available (is server option enabled?)')
  }
  return ctx.url + path
}

/**
 * Low level fetch API
 *
 * @remarks
 * This function is delegated with {@link ohmyfetch https://github.com/unjs/ohmyfetch}
 *
 * @param {string} path - The path of fetch request
 * @param {any} [options] - The options of fetch request, optional
 * @returns {Response} The response of fetch request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetch(path: string, options?: any) {
  return _fetch(url(path), options)
}

/**
 * Hight level fetch API
 *
 * @remarks
 * This function is delegated with {@link ohmyfetch https://github.com/unjs/ohmyfetch}
 *
 * @param {string} path - The path of fetch request
 * @param {FetchOptions} [options] - The options of fetch request, optional
 */
export function $fetch(path: string, options?: FetchOptions) {
  return _$fetch(url(path), options)
}
