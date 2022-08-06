import type { Browser, LaunchOptions } from 'playwright'
import type { UserConfig } from 'vite'
import type { ChildProcess } from 'node:child_process'

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
   * The Vite config object that is resolved by this utils
   */
  vite?: UserConfig
  /**
   * The Vite config file path that is resolved by this utils
   */
  viteConfig?: string
  /**
   * The Vite server process
   */
  server?: ChildProcess
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
