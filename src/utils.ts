import { isAbsolute, dirname, resolve, relative, join, extname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promises as fs, constants as FS_CONSTANTS } from 'node:fs'
import { createRequire } from 'node:module'
import { build } from 'esbuild'
import { normalizePath } from 'vite'
import createDebug from 'debug'

import type { UserConfigExport, ConfigEnv, UserConfig, LogLevel } from 'vite'

const DEBUG = createDebug('vite-test-utils:utils')

export async function isExists(path: string) {
  try {
    await fs.access(path, FS_CONSTANTS.F_OK)
    return true
  } catch {
    return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

const dynamicImport = new Function('file', 'return import(file)')

export async function loadConfig(
  configEnv: ConfigEnv,
  {
    configFile = 'vite.config.ts',
    configRoot = process.cwd()
  }: {
    configFile?: string
    configRoot?: string
  } = {}
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null> {
  const resolvedPath = resolve(configRoot, configFile)
  let isESM = false
  if (/\.m[jt]s$/.test(resolvedPath)) {
    isESM = true
  } else if (/\.c[jt]s$/.test(resolvedPath)) {
    isESM = false
  } else {
    // check package.json for type: "module" and set `isESM` to true
    try {
      const pkg = await lookupFile(configRoot, ['package.json'])
      isESM = !!pkg && JSON.parse(pkg).type === 'module'
    } catch (e) {} // eslint-disable-line no-empty
  }

  try {
    const bundled = await bundleConfigFile(resolvedPath, isESM)
    const userConfig = await loadConfigFromBundledFile(resolvedPath, bundled.code, isESM)
    DEBUG(`bundled config file loaded`)

    const config = await (typeof userConfig === 'function' ? userConfig(configEnv) : userConfig)
    if (!isObject(config)) {
      throw new Error(`config must export or return an object.`)
    }
    return {
      path: normalizePath(resolvedPath),
      config,
      dependencies: bundled.dependencies
    }
  } catch (e) {
    console.error(`failed to load config from ${resolvedPath}: ${(e as Error).message}`)
    throw e
  }
}

/**
 *  forked from the below:
 * - original repository url: https://github.com/vitejs/vite
 * - npm package name: `vite`
 * - code url: https://github.com/vitejs/vite/blob/22084a64264e84bcbb97eb9ccaa2d7672f0bee71/packages/vite/src/node/utils.ts#L390-L413
 * - author: Vite Core Team & community
 * - license: MIT
 */

interface LookupFileOptions {
  pathOnly?: boolean
  rootDir?: string
}

async function lookupFile(dir: string, formats: string[], options?: LookupFileOptions): Promise<string | undefined> {
  for (const format of formats) {
    const fullPath = join(dir, format)
    if ((await isExists(fullPath)) && (await fs.stat(fullPath)).isFile()) {
      return options?.pathOnly ? fullPath : await fs.readFile(fullPath, 'utf-8')
    }
  }
  const parentDir = dirname(dir)
  if (parentDir !== dir && (!options?.rootDir || parentDir.startsWith(options?.rootDir))) {
    return lookupFile(parentDir, formats, options)
  }
}

/**
 * forked from the below:
 * - original repository url: https://github.com/vitejs/vite
 * - npm package name: `vite`
 * - code url: https://github.com/vitejs/vite/blob/22084a64264e84bcbb97eb9ccaa2d7672f0bee71/packages/vite/src/node/config.ts#L923-L1015
 * - author: Vite Core Team & community
 * - license: MIT
 */

async function bundleConfigFile(fileName: string, isESM: boolean): Promise<{ code: string; dependencies: string[] }> {
  const dirnameVarName = '__vite_injected_original_dirname'
  const filenameVarName = '__vite_injected_original_filename'
  const importMetaUrlVarName = '__vite_injected_original_import_meta_url'
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    outfile: 'out.js',
    write: false,
    target: ['node14.18', 'node16'],
    platform: 'node',
    bundle: true,
    format: isESM ? 'esm' : 'cjs',
    sourcemap: 'inline',
    metafile: true,
    define: {
      __dirname: dirnameVarName,
      __filename: filenameVarName,
      'import.meta.url': importMetaUrlVarName
    },
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, async ({ path: id, importer }) => {
            // externalize bare imports
            if (id[0] !== '.' && !isAbsolute(id)) {
              return {
                external: true
              }
            }
            // bundle the rest and make sure that the we can also access
            // it's third-party dependencies. externalize if not.
            // monorepo/
            // ├─ package.json
            // ├─ utils.js -----------> bundle (share same node_modules)
            // ├─ vite-project/
            // │  ├─ vite.config.js --> entry
            // │  ├─ package.json
            // ├─ foo-project/
            // │  ├─ utils.js --------> external (has own node_modules)
            // │  ├─ package.json
            const idFsPath = resolve(dirname(importer), id)
            const idPkgPath = await lookupFile(idFsPath, [`package.json`], {
              pathOnly: true
            })
            if (idPkgPath) {
              const idPkgDir = dirname(idPkgPath)
              // if this file needs to go up one or more directory to reach the vite config,
              // that means it has it's own node_modules (e.g. foo-project)
              if (relative(idPkgDir, fileName).startsWith('..')) {
                return {
                  // normalize actual import after bundled as a single vite config
                  path: pathToFileURL(idFsPath).href,
                  external: true
                }
              }
            }
          })
        }
      },
      {
        name: 'inject-file-scope-variables',
        setup(build) {
          build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async args => {
            const contents = await fs.readFile(args.path, 'utf8')
            const injectValues =
              `const ${dirnameVarName} = ${JSON.stringify(dirname(args.path))};` +
              `const ${filenameVarName} = ${JSON.stringify(args.path)};` +
              `const ${importMetaUrlVarName} = ${JSON.stringify(pathToFileURL(args.path).href)};`

            return {
              loader: args.path.endsWith('ts') ? 'ts' : 'js',
              contents: injectValues + contents
            }
          })
        }
      }
    ]
  })
  const { text } = result.outputFiles[0]
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : []
  }
}

/**
 *  forked from the below:
 * - original repository url: https://github.com/vitejs/vite
 * - npm package name: `vite`
 * - code url: https://github.com/vitejs/vite/blob/22084a64264e84bcbb97eb9ccaa2d7672f0bee71/packages/vite/src/node/config.ts#L1017-L1060
 * - author: Vite Core Team & community
 * - license: MIT
 */

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any
}

const _require = createRequire(import.meta.url)

async function loadConfigFromBundledFile(
  fileName: string,
  bundledCode: string,
  isESM: boolean
): Promise<UserConfigExport> {
  // for esm, before we can register loaders without requiring users to run node
  // with --experimental-loader themselves, we have to do a hack here:
  // write it to disk, load it with native Node ESM, then delete the file.
  if (isESM) {
    const fileBase = `${fileName}.timestamp-${Date.now()}`
    const fileNameTmp = `${fileBase}.mjs`
    const fileUrl = `${pathToFileURL(fileBase)}.mjs`
    await fs.writeFile(fileNameTmp, bundledCode)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await dynamicImport(fileUrl).then((mod: any) => mod.default || mod)
    } finally {
      await fs.unlink(fileNameTmp)
    }
  }
  // for cjs, we can register a custom loader via `_require.extensions`
  else {
    const extension = extname(fileName)
    const realFileName = await fs.realpath(fileName)
    const loaderExt = extension in _require.extensions ? extension : '.js'
    const defaultLoader = _require.extensions[loaderExt]!
    _require.extensions[loaderExt] = (module: NodeModule, filename: string) => {
      if (filename === realFileName) {
        ;(module as NodeModuleWithCompile)._compile(bundledCode, filename)
      } else {
        defaultLoader(module, filename)
      }
    }
    // clear cache in case of server restart
    delete _require.cache[_require.resolve(fileName)]
    const raw = _require(fileName)
    _require.extensions[loaderExt] = defaultLoader
    return raw.__esModule ? raw.default : raw
  }
}
