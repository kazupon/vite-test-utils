/**
 * server module, forked from the below:
 * - original repository url: https://github.com/nuxt/framework
 * - npm package name: `@nuxt/test-utils`
 * - code url: https://github.com/nuxt/framework/blob/main/packages/test-utils/src/server.ts
 * - author: Nuxt Framework Team
 * - license: MIT
 */

import { fetch as _fetch, $fetch as _$fetch } from 'ohmyfetch'
import { useTestContext } from './context'

import type { FetchOptions } from 'ohmyfetch'

export async function startServer() {
  const ctx = useTestContext()
  throw new Error('TODO: not implemented')
}

export async function stopServer() {
  const ctx = useTestContext()
  throw new Error('TODO: not implemented')
}

export function url(path: string) {
  const ctx = useTestContext()
  throw new Error('TODO: not implemented')
}

export function fetch(path: string, options?: any) {
  throw new Error('TODO: not implemented')
}

export function $fetch(path: string, options?: FetchOptions) {
  throw new Error('TODO: not implemented')
}
