import type { Browser, LaunchOptions } from 'playwright'
import type { UserConfig, ViteDevServer, PreviewServer } from 'vite'

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
   * The Vite config that is resolved by this utils
   */
  vite?: UserConfig
  /**
   * The Vite server instance
   */
  server?: ViteDevServer | PreviewServer
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
   * The fixture directory path that is relative from `testDir`.
   *
   * @default 'fixture'
   */
  fixture?: string
  /**
   * The test directory path that is current run by utils.
   *
   * @default `process.cwd() + 'test'`
   */
  testDir?: string
  /**
   * The root directory path that is current run by utils. It’s resolved in priority over that `testDir`
   *
   * @default `process.cwd()`
   */
  rootDir?: string
  /**
   * The vite config filename. It's used with `rootDir` or `testDir`
   *
   * @default 'vite.config'
   */
  configFile?: string
  /**
   * The vite config that is overrided the config resolved by utils.
   *
   * @default {}
   */
  viteConfig?: UserConfig
  /**
   * The vite server working mode
   *
   * @remarks
   * If you use `'dev'`, vite-test-utils will start dev server, else you use `'preview'` vite-test-utils will build fixture and start preview server.
   *
   * @default 'dev'
   */
  mode?: 'dev' | 'preview'
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
