import type { Browser, LaunchOptions } from 'playwright'

export interface TestContext {
  options: TestOptions
  browser?: Browser
}

export interface TestOptions {
  rootDir?: string
  browserOptions?: {
    type?: 'chromium' | 'firefox' | 'webkit'
    launch?: LaunchOptions
  }
}
