import { createTestContext, useTestContext, setTestContext } from '../context'

let orgCwd: typeof process.cwd
beforeAll(() => {
  orgCwd = process.cwd
  process.cwd = vi.fn().mockImplementation(() => '/path/to')
})

afterAll(() => {
  process.cwd = orgCwd
})

test('basic', () => {
  // create test context
  const ctx = createTestContext({
    fixtureDir: 'myFixture',
    configFile: 'vite.dev.config.ts',
    viteConfig: {
      build: {
        outDir: './output'
      }
    },
    viteConfigFile: '/path/to/myFixture/vite.config.ts',
    mode: 'preview',
    browserOptions: {
      type: 'firefox',
      launch: { headless: true }
    }
  })
  expect(ctx.options.fixtureDir).toBe('myFixture')
  expect(ctx.options.configFile).toBe('vite.dev.config.ts')
  expect(ctx.options.viteConfig).toEqual({ build: { outDir: './output' } })
  expect(ctx.options.viteConfigFile).toBe('/path/to/myFixture/vite.config.ts')
  expect(ctx.options.mode).toBe('preview')
  expect(ctx.options.browserOptions).toEqual({ type: 'firefox', launch: { headless: true } })

  // call useTestContext()
  const ctx2 = useTestContext()
  expect(ctx2.options.fixtureDir).toBe('myFixture')
  expect(ctx2.options.configFile).toBe('vite.dev.config.ts')
  expect(ctx2.options.viteConfig).toEqual({ build: { outDir: './output' } })
  expect(ctx2.options.viteConfigFile).toBe('/path/to/myFixture/vite.config.ts')
  expect(ctx2.options.mode).toBe('preview')
  expect(ctx2.options.browserOptions).toEqual({ type: 'firefox', launch: { headless: true } })
  expect(ctx).toEqual(ctx2)

  // clear test context in context module
  expect(setTestContext(undefined)).toBeUndefined()
  expect(() => useTestContext()).toThrowError()
})

test('default options', () => {
  const ctx = createTestContext()
  expect(ctx.options.fixtureDir).toBe('/path/to')
  expect(ctx.options.configFile).toBeUndefined()
  expect(ctx.options.viteConfig).toBeUndefined()
  expect(ctx.options.viteConfigFile).toBeUndefined()
  expect(ctx.options.mode).toBe('dev')
  expect(ctx.options.browserOptions).toEqual({ type: 'chromium' })

  const ctx2 = useTestContext()
  expect(ctx2.options.fixtureDir).toBe('/path/to')
  expect(ctx2.options.configFile).toBeUndefined()
  expect(ctx2.options.viteConfig).toBeUndefined()
  expect(ctx2.options.viteConfigFile).toBeUndefined()
  expect(ctx2.options.mode).toBe('dev')
  expect(ctx2.options.browserOptions).toEqual({ type: 'chromium' })
})
