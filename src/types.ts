import type { Browser, LaunchOptions } from 'playwright'

export interface TestContext {
  options: TestOptions
  browser?: Browser
}

export interface TestOptions {
  testDir?: string
  browserOptions?: {
    type?: 'chromium' | 'firefox' | 'webkit'
    launch?: LaunchOptions
  }
}
