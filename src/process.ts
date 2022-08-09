import { createServer, preview } from 'vite'
import createDebug from 'debug'
import { loadFixture, buildFixture } from './vite'

import type { FixtureContext } from './vite'

const DEBUG = createDebug('vite-test-utils:process')

async function start(ctx: FixtureContext) {
  if (ctx.mode === 'dev') {
    const vite = await createServer({
      configFile: ctx.configFile,
      ...ctx.vite
    })
    DEBUG('resolvedConfig', vite.config)
    await vite.listen(ctx.port)
    vite.printUrls()
    return vite
  } else {
    const vite = await preview({
      ...ctx.vite,
      preview: {
        port: ctx.port
      }
    })
    DEBUG('resolvedConfig', vite.config)
    return vite
  }
}

async function main() {
  const ctx = await loadFixture(process.env)
  if (ctx.mode === 'preview') {
    await buildFixture(ctx)
  }
  await start(ctx)
}

main()
