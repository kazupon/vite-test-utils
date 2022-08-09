import { fileURLToPath } from 'node:url'
import { createTestContext } from '../context'
import { loadFixture, prepareFixture, getFixtureContextFrom, writeViteConfigOptions } from '../vite'

import type { FixtureContext } from '../vite'

afterEach(() => {
  ;[
    '__VTU_PORT',
    '__VTU_MODE',
    '__VTU_FIXTURE_ROOT',
    '__VTU_FIXTURE_BUILD_DIR',
    '__VTU_FIXTURE_CONFIG_FILE',
    '__VTU_FIXTURE_VITE_CONFIG',
    '__VTU_FIXTURE_VITE_CONFIG_FILE'
  ].forEach(key => {
    process.env[key]
    delete process.env[key]
  })
})

test('writeViteConfigOptions', async () => {
  const configFile = await writeViteConfigOptions({
    root: '/path/to',
    define: {
      'process.env.VITE_TEST_UTILS': JSON.stringify('test')
    },
    plugins: [
      {
        name: 'my-plugin',
        transform: (code, id) => {
          return code
        }
      }
    ]
  })
  const config = await import(configFile).then(m => m.default || m)
  expect(config.root).toBe('/path/to')
})

describe('getViteInternalOptionsFrom', () => {
  let orgCwd: typeof process.cwd
  beforeEach(() => {
    orgCwd = process.cwd
    process.cwd = vi.fn().mockImplementation(() => '/path/to')
  })

  afterEach(() => {
    process.cwd = orgCwd
  })

  test('default (not set in processs.env)', () => {
    const options = getFixtureContextFrom(process.env)
    expect(options).toEqual({
      port: 3000,
      mode: 'dev',
      root: '/path/to',
      buildDir: undefined,
      configFile: undefined,
      viteConfig: undefined,
      viteConfigFile: undefined
    } as FixtureContext)
  })

  test('process.env setting', () => {
    process.env.__VTU_PORT = '1234'
    process.env.__VTU_MODE = 'preview'
    process.env.__VTU_FIXTURE_ROOT = '/path/to/test/fixtures/fixutre1'
    process.env.__VTU_FIXTURE_BUILD_DIR = '/path/to/test/fixtures/fixutre1/build'
    process.env.__VTU_FIXTURE_CONFIG_FILE = 'vite.config.js'
    process.env.__VTU_FIXTURE_VITE_CONFIG = 'vite.primitive.config.mjs'
    process.env.__VTU_FIXTURE_VITE_CONFIG_FILE = 'vite.programmatic.config.mjs'

    const options = getFixtureContextFrom(process.env)
    expect(options).toEqual({
      port: 1234,
      mode: 'preview',
      root: '/path/to/test/fixtures/fixutre1',
      buildDir: '/path/to/test/fixtures/fixutre1/build',
      configFile: 'vite.config.js',
      viteConfig: 'vite.primitive.config.mjs',
      viteConfigFile: 'vite.programmatic.config.mjs'
    } as FixtureContext)
  })
})

const CHECK_CONFIG = {
  define: {
    'process.env.VITE_TEST_UTILS': 'test'
  }
}

describe('loadFixture', async () => {
  test('basic', async () => {
    const ctx = createTestContext({
      fixtureDir: fileURLToPath(new URL(`./fixtures/vite`, import.meta.url)),
      viteConfig: {
        define: {
          __VERSION__: '"1.0.0"'
        }
      }
    })
    await prepareFixture()
    process.env.__VTU_FIXTURE_ROOT = ctx.options.fixtureDir
    process.env.__VTU_FIXTURE_VITE_CONFIG = ctx.viteConfigInline

    const fixtureCtx = await loadFixture(process.env)
    expect(fixtureCtx.root).toBe(ctx.options.fixtureDir)
    expect(fixtureCtx.viteConfig).toBe(ctx.viteConfigInline)
    expect(fixtureCtx.vite).toMatchObject({
      define: {
        __VERSION__: '"1.0.0"'
      }
    })
  })

  test('configFile', async () => {
    const ctx = createTestContext({
      fixtureDir: fileURLToPath(new URL(`./fixtures/vite`, import.meta.url)),
      configFile: 'vite.config.dev.ts',
      viteConfig: {
        define: {
          __VERSION__: '"1.0.0"'
        }
      }
    })
    await prepareFixture()
    process.env.__VTU_FIXTURE_ROOT = ctx.options.fixtureDir
    process.env.__VTU_FIXTURE_CONFIG_FILE = ctx.options.configFile
    process.env.__VTU_FIXTURE_VITE_CONFIG = ctx.viteConfigInline

    const fixtureCtx = await loadFixture(process.env)
    expect(fixtureCtx.root).toBe(ctx.options.fixtureDir)
    expect(fixtureCtx.viteConfig).toBe(ctx.viteConfigInline)
    expect(fixtureCtx.vite).toMatchObject({
      define: {
        __VERSION__: '"1.0.0"'
      }
    })
  })

  test('viteConfigFile', async () => {
    const ctx = createTestContext({
      fixtureDir: fileURLToPath(new URL(`./fixtures/vite`, import.meta.url)),
      viteConfigFile: 'vite.programmatic.config.ts'
    })
    await prepareFixture()
    process.env.__VTU_FIXTURE_ROOT = ctx.options.fixtureDir
    process.env.__VTU_FIXTURE_CONFIG_FILE = ctx.options.configFile
    process.env.__VTU_FIXTURE_VITE_CONFIG_FILE = ctx.options.viteConfigFile

    const fixtureCtx = await loadFixture(process.env)
    expect(fixtureCtx.root).toBe(ctx.options.fixtureDir)
    expect(fixtureCtx.vite).toHaveProperty('plugins')
  })

  test('preview', async () => {
    const ctx = createTestContext({
      fixtureDir: fileURLToPath(new URL(`./fixtures/vite`, import.meta.url)),
      mode: 'preview'
    })
    await prepareFixture()
    process.env.__VTU_FIXTURE_ROOT = ctx.options.fixtureDir
    process.env.__VTU_MODE = ctx.options.mode
    process.env.__VTU_FIXTURE_BUILD_DIR = ctx.buildDir

    const fixtureCtx = await loadFixture(process.env)
    expect(fixtureCtx.vite?.build?.outDir).toBe(ctx.buildDir)
  })

  test('no config fixture', async () => {
    const ctx = createTestContext({
      fixtureDir: fileURLToPath(new URL(`./fixtures/no-config`, import.meta.url))
    })
    await prepareFixture()
    process.env.__VTU_FIXTURE_ROOT = ctx.options.fixtureDir
    process.env.__VTU_FIXTURE_VITE_CONFIG = ctx.viteConfigInline || ''

    let err = false
    try {
      const fixtureCtx = await loadFixture(process.env)
    } catch {
      err = true
    }
    expect(err).toBe(true)
  })
})
