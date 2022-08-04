import type { Browser, LaunchOptions } from 'playwright'
import type { UserConfig } from 'vite'

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
}

export interface TestOptions {
  /**
   * The fixture directory path that is relative from `testDir`.
   */
  fixture?: string
  /**
   * The test directory path that is current run by utils.
   */
  testDir?: string
  /**
   * The root directory path that is current run by utils. It’s resolved in priority over that `testDir`
   */
  rootDir?: string
  /**
   * The vite config filename. It's used with `rootDir` or `testDir`
   */
  configFile?: string
  /**
   * The vite config that is overrided the config resolved by utils.
   */
  viteConfig?: UserConfig
  /**
   * The playwright browser options.
   */
  browserOptions?: {
    type?: 'chromium' | 'firefox' | 'webkit'
    launch?: LaunchOptions
  }
}
