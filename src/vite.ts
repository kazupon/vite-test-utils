import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { mergeConfig, build, ConfigEnv } from 'vite'
import pc from 'picocolors'
import createDebug from 'debug'
import { useTestContext } from './context'
import { isExists, loadConfig, mkTmpDir, toCode } from './utils'

import type { UserConfig } from 'vite'
import type { TestOptions } from './types'

export type FixtureContext = {
  port: number
  mode: Required<TestOptions>['mode']
  root: string
  buildDir?: string
  configFile?: string
  viteConfig?: string
  viteConfigFile?: string
  vite?: UserConfig
}

const DEBUG = createDebug('vite-test-utils:vite')

export function getFixtureContextFrom(env: NodeJS.ProcessEnv): FixtureContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {}

  // TODO: should type check !!
  options.port = env.__VTU_PORT != null ? parseInt(env.__VTU_PORT) : 3000
  // prettier-ignore
  options.mode = env.__VTU_MODE != null && ['dev', 'preview'].includes(env.__VTU_MODE)
    ? env.__VTU_MODE
    : 'dev'
  options.root = env.__VTU_FIXTURE_ROOT ?? process.cwd()
  options.buildDir = env.__VTU_FIXTURE_BUILD_DIR
  options.configFile = env.__VTU_FIXTURE_CONFIG_FILE
  options.viteConfig = env.__VTU_FIXTURE_VITE_CONFIG
  options.viteConfigFile = env.__VTU_FIXTURE_VITE_CONFIG_FILE

  return options
}

/**
 * The below config file is supported by vite
 * https://github.com/vitejs/vite/blob/22084a64264e84bcbb97eb9ccaa2d7672f0bee71/packages/vite/src/node/constants.ts#L35-L42
 */
const DEFAULT_CONFIG_FILES = [
  'vite.config.mjs',
  'vite.config.mts',
  'vite.config.cjs',
  'vite.config.cts',
  'vite.config.ts',
  'vite.config.js'
] as const

async function resolveViteConfig(
  dir: string,
  {
    config = 'vite.config.ts',
    viteDefaultConfigCheck = true
  }: { config?: string; viteDefaultConfigCheck?: boolean } = {}
): Promise<[boolean, string | null]> {
  DEBUG('resolveViteConfig: ', dir, config, viteDefaultConfigCheck)

  if (!(await isExists(dir))) {
    DEBUG('resolveViteConfig: dir not exists', dir)
    return [false, null]
  }

  const configFiles = viteDefaultConfigCheck ? DEFAULT_CONFIG_FILES : [config]
  DEBUG('resolveViteConfig: configFiles -> ', configFiles)

  let found = false
  let resolveViteConfig: string | null = null
  for (const config of configFiles) {
    const target = resolve(dir, config)
    DEBUG('resolveViteConfig: target -> ', target)
    if (await isExists(target)) {
      found = true
      resolveViteConfig = target
      break
    }
  }

  DEBUG('resolveViteConfig: final -> ', found, resolveViteConfig)
  return [found, resolveViteConfig]
}

async function resolveFixture(fixtureDir: string, config?: string): Promise<boolean> {
  if (config) {
    const [found] = await resolveViteConfig(fixtureDir, { config, viteDefaultConfigCheck: false })
    if (found) {
      return true
    }
  }

  let found = false
  const dirs = [fixtureDir, process.cwd()]
  for (const dir of dirs) {
    const [_found, resolvedViteConfig] = await resolveViteConfig(dir)
    DEBUG('resolveFixture:', dir, found, resolvedViteConfig)
    if (_found) {
      found = true
      break
    }
  }

  DEBUG('resolvedViteConfig: final', found)
  return found
}

function getViteCommand(mode: FixtureContext['mode']): ConfigEnv['command'] {
  return mode === 'dev' ? 'serve' : 'build'
}

function getViteMode(mode: FixtureContext['mode']): NodeJS.ProcessEnv['NODE_ENV'] {
  return mode === 'dev' ? 'development' : 'production'
}

async function loadViteConfig(
  configRoot: string,
  configFile: string,
  optionName: string,
  mode: FixtureContext['mode']
): Promise<UserConfig> {
  DEBUG('loadViteConfig:', configRoot, configFile, optionName, mode)
  const result = await loadConfig(
    {
      command: getViteCommand(mode),
      mode: getViteMode(mode)
    },
    {
      configFilePath: configFile,
      configRoot: configRoot
    }
  )
  if (result == null) {
    console.warn(pc.yellow(pc.bold(`Cannot load from '${optionName}' option`)))
    return {}
  } else {
    return result.config
  }
}

export async function writeViteConfigOptions(options: UserConfig): Promise<string> {
  const tmp = await mkTmpDir('vite-config-inline')
  const configTmp = resolve(tmp, 'vite.config.mjs')
  DEBUG('writeViteConfigOptions: configTmp -> ', configTmp)
  await fs.writeFile(configTmp, `export default ${toCode(options)}`, 'utf-8')
  return configTmp
}

export async function mkBuildDir() {
  return await mkTmpDir(Math.random().toString(36).slice(2, 8))
}

export async function prepareFixture() {
  const ctx = useTestContext()
  if (ctx.options.viteConfig) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ctx.viteConfigInline = await writeViteConfigOptions(ctx.options.viteConfig!)
  }
  if (ctx.options.mode === 'preview') {
    ctx.buildDir = await mkBuildDir()
  }
}

export async function loadFixture(env?: NodeJS.ProcessEnv): Promise<FixtureContext> {
  const ctx = getFixtureContextFrom(env || process.env)
  const { mode, root, configFile, viteConfig, viteConfigFile } = ctx

  // check if the fixture is exists
  if (!(await resolveFixture(root, configFile))) {
    console.warn(pc.yellow(pc.bold(`vite config has been not found in ${root}`)))
    console.warn(
      pc.yellow(
        pc.bold(
          'The fixture that will work from now on will follow the vite defaults or you have specified options that are `viteConfig` or `viteConfigFile` options.'
        )
      )
    )
  }

  // vite override config
  // prettier-ignore
  ctx.vite = viteConfigFile
    ? await loadViteConfig(root, resolve(root, viteConfigFile), 'viteConfigFile', mode)
    : viteConfig
      ? await loadViteConfig(root, viteConfig, 'viteConfig', mode)
      : {}

  ctx.vite = mergeConfig(ctx.vite, {
    root,
    logLevel: mode === 'preview' ? 'silent' : 'info',
    build: {
      outDir: mode === 'preview' ? ctx.buildDir : undefined
    }
  } as UserConfig)

  return ctx
}

export async function buildFixture(ctx: FixtureContext) {
  await build(ctx.vite)
}
