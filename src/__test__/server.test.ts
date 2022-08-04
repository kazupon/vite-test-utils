import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createTestContext, useTestContext } from '../context'
import { loadFixture } from '../vite'
import { startServer, stopServer, url, $fetch, fetch } from '../server'
import { sleep } from './helper'
import MyPlugin from './fixtures/server/plugin'

const __dirname = fileURLToPath(new URL(`./fixtures/server`, import.meta.url))

// TODO: fix segmentation fault in loadFixture ...
vi.mock('../vite', () => {
  const loadFixture = vi.fn()
  loadFixture.mockImplementation(() => {
    const ctx = useTestContext()
    ctx.options.rootDir = __dirname
    const buildDir = resolve(__dirname, './.vite/abcde')
    ctx.vite = {
      root: __dirname,
      plugins: [MyPlugin()],
      build: {
        outDir: buildDir
      }
    }
  })
  return {
    loadFixture
  }
})

test('server', async () => {
  const ctx = createTestContext({
    rootDir: __dirname
  })
  await loadFixture()

  await startServer()
  await sleep(1000)
  assert(ctx.url?.startsWith('http://127.0.0.1'))
  assert(ctx.server != null)

  expect(url('/foo')).toBe(`http://127.0.0.1:${ctx.port}/foo`)

  let rawRes = await fetch('/')
  expect(rawRes.status).toBe(200)

  let res = await $fetch('/')
  expect(res).toMatch('Vite + TS')

  await stopServer()
  await sleep(1000)

  // TODO: check!
  // rawRes = await fetch('/')
  // res = await $fetch('/')
  // console.log(res)
  expect(ctx.server).toBeUndefined()
  expect(ctx.port).toBeUndefined()
})
