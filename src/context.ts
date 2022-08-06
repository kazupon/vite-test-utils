/**
 * context module, forked from the below:
 * - original repository url: https://github.com/nuxt/framework
 * - npm package name: `@nuxt/test-utils`
 * - code url: https://github.com/nuxt/framework/blob/main/packages/test-utils/src/context.ts
 * - author: Nuxt Framework Team
 * - license: MIT
 */

import { resolve } from 'node:path'
import { defu } from 'defu'

import type { TestContext, TestOptions } from './types'

let currentContext: TestContext | undefined

export function createTestContext(options: TestOptions = {}): TestContext {
  const cwd = process.cwd()
  const _options = defu(options, {
    rootDir: cwd,
    fixture: 'fixture',
    testDir: resolve(cwd, 'test'),
    configFile: 'vite.config',
    viteConfig: {},
    mode: 'dev',
    browserOptions: {
      type: 'chromium'
    }
  })
  return setTestContext({ options: _options as TestOptions }) as TestContext
}

export function setTestContext(ctx: TestContext | undefined) {
  currentContext = ctx
  return currentContext
}

export function useTestContext() {
  if (!currentContext) {
    throw new Error('No context is available. (Forgot calling setup?)')
  }
  return currentContext
}
