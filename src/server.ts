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
