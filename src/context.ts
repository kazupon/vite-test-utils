import { resolve } from 'node:path'
import { defu } from 'defu'

import type { TestContext, TestOptions } from './types'

let currentContext: TestContext | undefined

export function createTestContext(options: TestOptions = {}): TestContext {
  const _options = defu(options, {
    rootDir: resolve(process.cwd(), 'test')
  })
  return setTestContext({ options: _options }) as TestContext
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
