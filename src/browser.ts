/**
 * browser module, forked from the below:
 * - original repository url: https://github.com/nuxt/framework
 * - npm package name: `@nuxt/test-utils`
 * - code url: https://github.com/nuxt/framework/blob/main/packages/test-utils/src/browser.ts
 * - author: Nuxt Framework Team
 * - license: MIT
 */

import { useTestContext } from './context'
import { url } from './server'
import { dynamicImport } from './utils'

import type { Browser, BrowserContextOptions } from 'playwright'

export async function createBrowser() {
  const ctx = useTestContext()

  if (!ctx.options.browser) {
    throw new Error('browser feature is not available (is `browser` option enabled?)')
  }

  const playwright = await dynamicImport<typeof import('playwright')>('playwright')

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

/**
 *
 * @param {string} [path] - The path to the page, optional
 * @param {BrowserContextOptions} [options] - The browser context options, optional
 * @returns {Page} A page instance
 */
export async function createPage(path?: string, options?: BrowserContextOptions) {
  const browser = await getBrowser()

  const page = await browser.newPage(options)
  if (path) {
    await page.goto(url(path))
  }

  return page
}
