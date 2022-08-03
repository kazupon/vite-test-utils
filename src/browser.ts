import { useTestContext } from './context'

import type { BrowserContextOptions } from 'playwright'

export async function createBrowser() {
  const ctx = useTestContext()
  throw new Error('TODO: not implemented')
}

export async function getBrowser() {
  const ctx = useTestContext()
  throw new Error('TODO: not implemented')
}

export async function createPage(path?: string, options?: BrowserContextOptions) {
  const ctx = useTestContext()
  throw new Error('TODO: not implemented')
}
