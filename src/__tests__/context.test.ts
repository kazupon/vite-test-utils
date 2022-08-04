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
    fixture: 'myFixture',
    rootDir: '/',
    testDir: '.',
    configFile: 'myVite.config',
    viteConfig: {
      build: {
        outDir: './output'
      }
    },
    browserOptions: {
      type: 'firefox',
      launch: { headless: true }
    }
  })
  expect(ctx.options.fixture).toBe('myFixture')
  expect(ctx.options.rootDir).toBe('/')
  expect(ctx.options.testDir).toBe('.')
  expect(ctx.options.configFile).toBe('myVite.config')
  expect(ctx.options.viteConfig).toEqual({ build: { outDir: './output' } })
  expect(ctx.options.browserOptions).toEqual({ type: 'firefox', launch: { headless: true } })

  // call useTestContext()
  const ctx2 = useTestContext()
  expect(ctx2.options.fixture).toBe('myFixture')
  expect(ctx2.options.rootDir).toBe('/')
  expect(ctx2.options.testDir).toBe('.')
  expect(ctx2.options.configFile).toBe('myVite.config')
  expect(ctx2.options.viteConfig).toEqual({ build: { outDir: './output' } })
  expect(ctx2.options.browserOptions).toEqual({ type: 'firefox', launch: { headless: true } })
  expect(ctx).toEqual(ctx2)

  // clear test context in context module
  expect(setTestContext(undefined)).toBeUndefined()
  expect(() => useTestContext()).toThrowError()
})

test('default options', () => {
  const ctx = createTestContext()
  expect(ctx.options.fixture).toBe('fixture')
  expect(ctx.options.rootDir).toBe('/path/to')
  expect(ctx.options.testDir).toBe('/path/to/test')
  expect(ctx.options.configFile).toBe('vite.config')
  expect(ctx.options.viteConfig).toEqual({})
  expect(ctx.options.browserOptions).toEqual({ type: 'chromium' })

  const ctx2 = useTestContext()
  expect(ctx2.options.fixture).toBe('fixture')
  expect(ctx2.options.rootDir).toBe('/path/to')
  expect(ctx2.options.testDir).toBe('/path/to/test')
  expect(ctx2.options.configFile).toBe('vite.config')
  expect(ctx2.options.viteConfig).toEqual({})
  expect(ctx2.options.browserOptions).toEqual({ type: 'chromium' })
})
