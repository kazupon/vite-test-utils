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
    testDir: '.',
    browserOptions: {
      type: 'firefox',
      launch: { headless: true }
    }
  })
  expect(ctx.options.testDir).toBe('.')
  expect(ctx.options.browserOptions).toEqual({ type: 'firefox', launch: { headless: true } })

  // call useTestContext()
  const ctx2 = useTestContext()
  expect(ctx2.options.testDir).toBe('.')
  expect(ctx2.options.browserOptions).toEqual({ type: 'firefox', launch: { headless: true } })
  expect(ctx).toEqual(ctx2)

  // clear test context in context module
  expect(setTestContext(undefined)).toBeUndefined()
  expect(() => useTestContext()).toThrowError()
})

test('default options', () => {
  const ctx = createTestContext()
  expect(ctx.options.testDir).toBe('/path/to/test')
  expect(ctx.options.browserOptions).toEqual({ type: 'chromium' })

  const ctx2 = useTestContext()
  expect(ctx2.options.testDir).toBe('/path/to/test')
  expect(ctx2.options.browserOptions).toEqual({ type: 'chromium' })
})
