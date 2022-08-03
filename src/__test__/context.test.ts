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
    rootDir: '.'
  })
  expect(ctx.options.rootDir).toBe('.')

  // call useTestContext()
  const ctx2 = useTestContext()
  expect(ctx2.options.rootDir).toBe('.')
  expect(ctx).toEqual(ctx2)

  // clear test context in context module
  expect(setTestContext(undefined)).toBeUndefined()
  expect(() => useTestContext()).toThrowError()
})

test('default options', () => {
  const ctx = createTestContext()
  expect(ctx.options.rootDir).toBe('/path/to/test')

  const ctx2 = useTestContext()
  expect(ctx2.options.rootDir).toBe('/path/to/test')
})
