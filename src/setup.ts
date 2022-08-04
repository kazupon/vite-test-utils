/**
 * setup module, forked from the below:
 * - original repository url: https://github.com/nuxt/framework
 * - npm package name: `@nuxt/test-utils`
 * - code url: https://github.com/nuxt/framework/blob/main/packages/test-utils/src/setup/index.ts
 * - author: Nuxt Framework Team
 * - license: MIT
 */

import { createTestContext, setTestContext } from './context'
import { startServer, stopServer } from './server'
import { loadFixture } from './vite'
import { createBrowser } from './browser'
import { dynamicImport } from './utils'

import type { TestOptions } from './types'

function createTest(options: TestOptions = {}) {
  const ctx = createTestContext(options)

  const beforeEach = async () => {
    setTestContext(ctx)
  }

  const afterEach = async () => {
    setTestContext(undefined)
  }

  const afterAll = async () => {
    if (ctx.server) {
      setTestContext(ctx)
      await stopServer()
      setTestContext(undefined)
    }
    if (ctx.browser) {
      await ctx.browser.close()
      ctx.browser = undefined
    }
  }

  const setup = async () => {
    await loadFixture()
    await createBrowser()
    await startServer()
  }

  return {
    beforeEach,
    afterEach,
    afterAll,
    setup,
    ctx
  }
}

export async function setup(options: TestOptions = {}) {
  const vitest = await dynamicImport<typeof import('vitest')>('vitest')
  const hooks = createTest(options)

  vitest.beforeAll(hooks.setup, 120 * 1000)
  vitest.afterAll(hooks.afterAll)
  vitest.beforeEach(hooks.beforeEach)
  vitest.afterEach(hooks.afterEach)
}
