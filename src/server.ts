/**
 * server module, forked from the below:
 * - original repository url: https://github.com/nuxt/framework
 * - npm package name: `@nuxt/test-utils`
 * - code url: https://github.com/nuxt/framework/blob/main/packages/test-utils/src/server.ts
 * - author: Nuxt Framework Team
 * - license: MIT
 */

import { resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { fetch as _fetch, $fetch as _$fetch } from 'ohmyfetch'
import { getRandomPort, waitForPort } from 'get-port-please'
import { useTestContext } from './context'
import express from 'express'
import { createServer } from 'vite'
import createDebug from 'debug'

import type { FetchOptions } from 'ohmyfetch'
import type { InlineConfig } from 'vite'

const DEBUG = createDebug('vite-test-utils:server')

export async function startServer() {
  const ctx = useTestContext()

  DEBUG('sdfsdfs')
  await stopServer()

  const port = (ctx.port = await getRandomPort())
  ctx.url = `http://127.0.0.1:${port}`
  DEBUG(`ctx.url: ${ctx.url}`)

  const inlineConfig = Object.assign(
    {
      configFile: false,
      logLevel: 'info',
      server: {
        hmr: false,
        middlewareMode: true
      }
    } as InlineConfig,
    ctx.vite
  )
  DEBUG('inline config:', inlineConfig)

  const vite = (ctx.server = await createServer(inlineConfig))

  const app = express()
  app.use(vite.middlewares)
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      DEBUG('request url: ', url)
      if (url === '/') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const template = await fs.readFile(resolve(ctx.options.rootDir!, 'index.html'), 'utf-8')
        // DEBUG("tempalte ->\n", template);
        const transformedHTML = await vite.transformIndexHtml(url, template)
        // DEBUG("transformedHTML ->\n", transformedHTML);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHTML)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      vite && vite.ssrFixStacktrace(e)
      console.error(e.stack)
      res.status(500).end(e.stack)
    }
  })

  app.listen(port, () => {
    // vite.printUrls();
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
    await ctx.server.close()
    ctx.server = undefined
    ctx.port = undefined
  }
}

export function url(path: string) {
  const ctx = useTestContext()
  if (!ctx.url) {
    throw new Error('url is not available (is server option enabled?)')
  }
  return ctx.url + path
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetch(path: string, options?: any) {
  return _fetch(url(path), options)
}

export function $fetch(path: string, options?: FetchOptions) {
  return _$fetch(url(path), options)
}
