import { createServer } from 'vite'
import { getRandomPort } from 'get-port-please'
import createDebug from 'debug'

import type { InlineConfig } from 'vite'

const DEBUG = createDebug('vite-test-utils:dev')

async function main() {
  const config = process.env.VITE_TEST_UTILS_CONFIG
  if (!config) {
    throw new Error('Not found VITE_TEST_UTILS_CONFIG')
  }

  // TODO: check `VITE_TEST_UTILS_PORT` is available
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const port = parseInt(process.env.VITE_TEST_UTILS_PORT!) || (await getRandomPort())

  const inlineConfig: InlineConfig = {
    configFile: config,
    logLevel: 'info',
    server: {
      hmr: false
      // middlewareMode: true
    },
    plugins: [
      {
        name: 'vite-test-utils:server',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            DEBUG('req.originalUrl', req.originalUrl)
            next()
          })
        }
      }
    ]
  }
  DEBUG('inline config:', inlineConfig)

  const vite = await createServer(inlineConfig)
  await vite.listen(port)
}

main()
