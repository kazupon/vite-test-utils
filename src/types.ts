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
   * The Vite server instance
   */
  server?: ChildProcess
  /**
   * The vite config inline filepath that is configured by `{@link viteConfig}` option
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
   * The fixture directory path that is put in your vite application project
   *
   * @remarks
   * If vite-test-utils cannot found vite config in this option, it falls back to `process.cwd()`
   *
   * @default `process.cwd()`
   */
  fixtureDir?: string
  /**
   * The vite config **filename** which is used in test fixture.
   *
   * @remarks
   * If vite config file is specified with this option, it will be respected over the default config file that will be resolved by vite.
   *
   * The file for this option is **relative** to the directory specified in the `fixtureDir` option.
   */
  configFile?: string
  /**
   * The vite config that is overrided the config resolved by utils.
   *
   * @remarks
   * Simply, use this option if you hope override the vite config with **javascript premitive value** such as object or string.
   *
   * If you hope set up programmaticaly overrides using like `import` syntax, you must prepare the vite config for the override and specify it with `viteConfigPath`.
   */
  viteConfig?: UserConfig
  /**
   * The vite config file path that is overrided the config resolved by utils.
   *
   * @remarks
   * If this option is specified, it's respected than `viteConfig` option.
   */
  viteConfigFile?: string
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
