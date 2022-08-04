import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { useTestContext } from './context'
import { mergeConfig } from 'vite'
import { isExists, loadConfig } from './utils'
import createDebug from 'debug'

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
  let found = false
  let _config = ''

  if (!(await isExists(dir))) {
    return [found, _config]
  }

  const configFiles = [...DEFAULT_CONFIG_FILES, config]
  DEBUG('resolveViteConfig: configFiles -> ', configFiles)

  for (const config of configFiles) {
    if (await isExists(resolve(dir, config))) {
      _config = config
      found = true
      break
    }
  }

  DEBUG('resolveViteConfig: ', dir, found, _config)
  return [found, _config]
}

async function resolveRootDirAndConfig() {
  const { options } = useTestContext()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dirs = [options.rootDir, resolve(options.testDir!, options.fixture!), process.cwd()]
  DEBUG('resolveRootDirAndConfig: dirs -> ', dirs)

  for (const dir of dirs) {
    if (dir) {
      const [found, config] = await resolveViteConfig(dir, options.configFile)
      DEBUG('resolveRootDirAndConfig: ', dir, found, config)
      if (found && config) {
        return [dir, config]
      }
    }
  }

  throw new Error(
    'Invalid vite app. (Please explicitly set `options.rootDir` or `options.config` pointing to a valid vite app)'
  )
}

export async function loadFixture() {
  const ctx = useTestContext()

  const [rootDir, configFile] = await resolveRootDirAndConfig()
  ctx.options.rootDir = rootDir
  DEBUG('loadFixture: rootDir -> ', rootDir)
  DEBUG('loadFixture: configFile -> ', configFile)

  const randomId = Math.random().toString(36).slice(2, 8)
  const buildDir = resolve(ctx.options.rootDir, '.vite', randomId)
  DEBUG('loadFixture: buildDir -> ', buildDir)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Object.assign(ctx.options.viteConfig!, {
    root: rootDir,
    build: {
      outDir: buildDir
    }
  })
  DEBUG('loadFixture: viteConfig -> ', ctx.options.viteConfig)

  const result = await loadConfig(
    {
      mode: 'development', // TODO:
      command: 'build' // TODO:
    },
    {
      configFile,
      configRoot: rootDir
    }
  )
  if (!result) {
    throw new Error(`not found vite config file`)
  }
  DEBUG('loadFixture: loadConfig result -> ', result)

  const loadedConfig = result ? result.config : {}
  DEBUG('loadFixture: loadedConfig -> ', loadedConfig)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ctx.vite = mergeConfig(loadedConfig, ctx.options.viteConfig!)
  DEBUG('loadFixture: final vite config -> ', ctx.vite)

  const ret = await fs.mkdir(buildDir, { recursive: true })
  console.log('loadFixture: mkdir -> ', ret)
}
