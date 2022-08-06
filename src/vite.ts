// import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { mergeConfig, build } from 'vite'
import pc from 'picocolors'
import createDebug from 'debug'
import { useTestContext } from './context'
import { isExists, loadConfig, mkTmpDir } from './utils'

import type { InlineConfig, UserConfig } from 'vitest'

const DEBUG = createDebug('vite-test-utils:vite')

/**
 * The below config file is supported by vite
 * https://github.com/vitejs/vite/blob/22084a64264e84bcbb97eb9ccaa2d7672f0bee71/packages/vite/src/node/constants.ts#L35-L42
 */
const DEFAULT_CONFIG_FILES = [
  'vite.config.js',
  'vite.config.mjs',
  'vite.config.ts',
  'vite.config.cjs',
  'vite.config.mts',
  'vite.config.cts'
]

async function resolveViteConfig(dir: string, config = 'vite.config.ts'): Promise<[boolean, string]> {
  let hasDir = false
  let _config = ''

  if (!(await isExists(dir))) {
    return [hasDir, _config]
  }
  hasDir = true

  const configFiles = [...DEFAULT_CONFIG_FILES, config]
  DEBUG('resolveViteConfig: configFiles -> ', configFiles)

  for (const config of configFiles) {
    if (await isExists(resolve(dir, config))) {
      _config = config
      break
    }
  }

  DEBUG('resolveViteConfig: ', dir, hasDir, _config)
  return [hasDir, _config]
}

async function resolveRootDirAndConfig(): Promise<[string, string] | null> {
  const { options } = useTestContext()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dirs = [options.rootDir, resolve(options.testDir!, options.fixture!), process.cwd()]
  DEBUG('resolveRootDirAndConfig: dirs -> ', dirs)

  for (const dir of dirs) {
    if (dir) {
      const [hasDir, config] = await resolveViteConfig(dir, options.configFile)
      DEBUG('resolveRootDirAndConfig: ', dir, hasDir, config)
      if (hasDir && config) {
        return [dir, config]
      }
    }
  }

  console.warn(
    pc.yellow(
      pc.bold(
        'cannot not resolve project dir and config. (Please make sure `options.rootDir`, `options.config`, `options.testDir`, `options.fixture` configration)'
      )
    )
  )
  console.warn(pc.yellow(pc.bold('Use `options.viteConfig` as configuration.')))

  return null
}

export async function loadFixture() {
  const ctx = useTestContext()

  let rootDir = ''
  let configFile = ''
  let mergeTargetConfig: UserConfig | undefined

  const resolveResult = await resolveRootDirAndConfig()
  if (Array.isArray(resolveResult)) {
    ;[rootDir, configFile] = resolveResult
    DEBUG('loadFixture: rootDir -> ', rootDir)
    DEBUG('loadFixture: configFile -> ', configFile)

    const loadResult = await loadConfig(
      {
        mode: ctx.options.mode === 'dev' ? 'development' : 'production',
        command: ctx.options.mode === 'dev' ? 'serve' : 'build'
      },
      {
        configFile,
        configRoot: rootDir
      }
    )
    if (!loadResult) {
      throw new Error(`not found vite config file`)
    }
    DEBUG('loadFixture: loadConfig result -> ', loadResult)

    const loadedConfig = loadResult ? loadResult.config : {}
    DEBUG('loadFixture: loadedConfig -> ', loadedConfig)
    mergeTargetConfig = loadedConfig as UserConfig
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rootDir = ctx.options.rootDir!
    DEBUG('loadFixture: rootDir -> ', rootDir)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mergeTargetConfig = ctx.options.viteConfig! as UserConfig
  }

  let buildDir: string | undefined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (ctx.options.mode! === 'preview') {
    ctx.buildDir = buildDir = await mkTmpDir(Math.random().toString(36).slice(2, 8))
  }
  DEBUG('loadFixture: buildDir -> ', buildDir)

  ctx.vite = mergeConfig(
    mergeTargetConfig,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mergeConfig(ctx.options.viteConfig!, {
      logLevel: ctx.options.mode === 'preview' ? 'silent' : 'info',
      root: rootDir,
      build: {
        outDir: buildDir
      }
    } as InlineConfig)
  )
  DEBUG('loadFixture: final vite config -> ', ctx.vite)
}

export async function buildFixture() {
  const ctx = useTestContext()
  await build(ctx.vite)
}
