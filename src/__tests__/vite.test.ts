import { fileURLToPath } from 'node:url'
import { createTestContext } from '../context'
import { loadFixture, buildFixture } from '../vite'

const CHECK_CONFIG = {
  define: {
    'process.env.VITE_TEST_UTILS': 'test'
  }
}

test('resolve config with "options.rootDir"', async () => {
  const ctx = createTestContext({
    rootDir: fileURLToPath(new URL(`./fixtures/vite`, import.meta.url))
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject(CHECK_CONFIG)
})

test('resolve config with "options.testDir" and "optiosn.fixture"', async () => {
  const ctx = createTestContext({
    testDir: 'src/__tests__',
    fixture: 'fixtures/vite'
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject(CHECK_CONFIG)
})

test('resolve config with "options.configFile"', async () => {
  const ctx = createTestContext({
    testDir: 'src/__tests__',
    fixture: 'fixtures/vite',
    configFile: 'myvite.config'
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject(CHECK_CONFIG)
})

test('commonjs package', async () => {
  const ctx = createTestContext({
    rootDir: fileURLToPath(new URL(`./fixtures/cjs`, import.meta.url))
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject(CHECK_CONFIG)
})

test('cjs config file', async () => {
  const ctx = createTestContext({
    testDir: 'src/__tests__',
    fixture: 'fixtures/cjs-config'
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject(CHECK_CONFIG)
})

test('no vite config case', async () => {
  const root = fileURLToPath(new URL(`./fixtures/no-config`, import.meta.url))
  const ctx = createTestContext({
    rootDir: root
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject({ root })
})

test('override with "options.viteConfig"', async () => {
  const ctx = createTestContext({
    rootDir: fileURLToPath(new URL(`./fixtures/vite`, import.meta.url)),
    viteConfig: {
      define: {
        __VERSION__: '"1.0.0"'
      }
    }
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject({
    define: {
      __VERSION__: '"1.0.0"'
    }
  })
})

test('build', async () => {
  const ctx = createTestContext({
    rootDir: fileURLToPath(new URL(`./fixtures/server`, import.meta.url)),
    mode: 'preview',
    viteConfig: {
      define: {
        __VERSION__: '"1.0.0"'
      }
    }
  })
  await loadFixture()
  await buildFixture()
  expect(ctx.buildDir).toContain('vite-test-utils-')
})
