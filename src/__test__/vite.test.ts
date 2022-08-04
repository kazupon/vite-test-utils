import { fileURLToPath } from 'node:url'
import { createTestContext } from '../context'
import { loadFixture } from '../vite'

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
    testDir: 'src/__test__',
    fixture: 'fixtures/vite'
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject(CHECK_CONFIG)
})

test('resolve config with "options.configFile"', async () => {
  const ctx = createTestContext({
    testDir: 'src/__test__',
    fixture: 'fixtures/vite',
    configFile: 'myvite.config'
  })
  await loadFixture()
  expect(ctx.vite).toMatchObject(CHECK_CONFIG)
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
