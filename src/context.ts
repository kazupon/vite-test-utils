import type { TestContext, TestOptions } from './types'

let currentContext: TestContext | undefined

export function createTestContext(options: TestOptions) {
  throw new Error('TODO: not implemented')
}

export function setTestContext(ctx: TestContext | undefined) {
  throw new Error('TODO: Not implemented')
}

export function useTestContext() {
  throw new Error('TODO: Not implemented')
}
