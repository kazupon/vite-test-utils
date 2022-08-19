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
import { prepareFixture } from './vite'
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
    await prepareFixture()
    if (ctx.options.server) {
      await startServer()
    }
    if (ctx.options.browser) {
      await createBrowser()
    }
  }

  return {
    beforeEach,
    afterEach,
    afterAll,
    setup,
    ctx
  }
}

/**
 * The test setup function
 *
 * @remarks
 * This function will be hooked with using setup/teardown of vitest.
 * In setup hook, start the vite dev server, create a browser instance of playwright, and load the vite app fixture.
 * In the teardown hook, terminate the vite dev server and close the browser instance of playwright.
 *
 * @param {TestOptions} [options] - Optional, test Options that is used in `setup`, about details @see TestOptions
 */
export async function setup(options: TestOptions = {}) {
  const vitest = await dynamicImport<typeof import('vitest')>('vitest')
  const hooks = createTest(options)

  vitest.beforeAll(hooks.setup, 120 * 1000)
  vitest.afterAll(hooks.afterAll)
  vitest.beforeEach(hooks.beforeEach)
  vitest.afterEach(hooks.afterEach)
}
