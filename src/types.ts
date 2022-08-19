import type { Browser, LaunchOptions } from 'playwright'
import type { UserConfig } from 'vite'
import type { ChildProcess } from 'node:child_process'

import type { CreatePage } from './browser'
import type { StartServer, StopServer, Url, Fetch, $Fetch } from './server'

/**
 * The Test Context that is used in test utils
 */
export interface TestContext {
  /**
   * The options that is specified `setup` function
   */
  options: TestOptions
  /**
   * The browser instance that is created by playwright
   */
  browser?: Browser
  /**
   * The Vite server instance
   */
  server?: ChildProcess
  /**
   * The vite config inline filepath that is configured by `{@link TestOptions.viteConfig}` option
   */
  viteConfigInline?: string
  /**
   * The output directory
   */
  buildDir?: string
  /**
   * The port that is opened in server
   */
  port?: number
  /**
   * The url of the server
   */
  url?: string
}

/**
 * The Test Options that is used in `setup`
 */
export interface TestOptions {
  /**
   * The root directory path that is put in your vite application project
   *
   * If vite-test-utils could not find vite config in this option, it falls back to `process.cwd()`
   *
   * @default `process.cwd()`
   */
  rootDir?: string
  /**
   * The vite config **filename** which is used in test fixture.
   *
   * If vite config file is specified with this option, it will be respected over the default config file that will be resolved by vite.
   *
   * The file for this option is **relative** to the directory specified in the `rootDir` option.
   *
   * @default `'vite.config.ts' | 'vite.config.js' | 'vite.config.mjs' | 'vite.config.mts' | 'vite.config.cjs' | 'vite.config.cts'`
   */
  configFile?: string
  /**
   * The vite config that is overrided the config resolved by utils.
   *
   * Simply, use this option if you hope override the vite config with **javascript premitive value** such as object or string.
   *
   * If you hope set up programmaticaly overrides using like `import` syntax, you must prepare the vite config for the override and specify it with `viteConfigPath`.
   *
   * @default `{}`
   */
  viteConfig?: UserConfig
  /**
   * The vite config file path that is overrided the config resolved by utils.
   *
   * If this option is specified, it's respected than `viteConfig` option.
   *
   * @default `undefined`
   */
  viteConfigFile?: string
  /**
   * The vite server working mode
   *
   * If you use `'dev'`, vite-test-utils will start dev server, else you use `'preview'` vite-test-utils will build fixture and start preview server.
   *
   * @default 'dev'
   */
  mode?: 'dev' | 'preview'
  /**
   * Whether to start the server while running `setup`
   *
   * @default false
   */
  server?: boolean
  /**
   * Whether to create the playwright `Browser` instance while running `setup`
   *
   * @default false
   */
  browser?: boolean
  /**
   * The playwright browser options.
   */
  browserOptions?: {
    /**
     * The browser type.
     *
     * @default 'chromium'
     */
    type?: 'chromium' | 'firefox' | 'webkit'
    /**
     * The browser launch options.
     */
    launch?: LaunchOptions
  }
}

export interface TestUtilsContext {
  createPage: CreatePage
  startServer: StartServer
  stopServer: StopServer
  url: Url
  fetch: Fetch
  $fetch: $Fetch
}
