export { createPage } from './browser'
export { url, fetch, $fetch } from './server'
export { setup } from './setup'
export * from './types'

export function say(msg: string) {
  console.log(msg)
  return msg
}
