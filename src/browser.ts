import { useTestContext } from './context'

import type { Browser, BrowserContextOptions } from 'playwright'

export async function createBrowser() {
  const ctx = useTestContext()

  let playwright: typeof import('playwright')
  try {
    playwright = await import(String('playwright'))
  } catch {
    /* istanbul ignore next */
    throw new Error(`
      The dependency 'playwright' not found.
      Please run 'yarn add --dev playwright' or 'npm install --save-dev playwright' or 'pnpm add --save-dev playwright'
    `)
  }

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const { type, launch } = ctx.options.browserOptions!
  if (!playwright[type!]) {
    throw new Error(`Invalid browser '${type}'`)
  }

  ctx.browser = await playwright[type!].launch(launch)
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
}

async function getBrowser() {
  const ctx = useTestContext()
  if (!ctx.browser) {
    await createBrowser()
  }
  return ctx.browser as Browser
}

export async function createPage(path?: string, options?: BrowserContextOptions) {
  const browser = await getBrowser()
  return await browser.newPage(options)
}
