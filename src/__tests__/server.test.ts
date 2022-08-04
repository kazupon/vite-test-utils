import { fileURLToPath } from 'node:url'
import { createTestContext } from '../context'
import { loadFixture } from '../vite'
import { startServer, stopServer, url, $fetch, fetch } from '../server'
import { sleep } from './helper'

const __dirname = fileURLToPath(new URL(`./fixtures/server`, import.meta.url))

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

  const rawRes = await fetch('/')
  expect(rawRes.status).toBe(200)

  const res = await $fetch('/')
  expect(res).toContain(`<title>Vite + TS</title>`)

  await stopServer()
  await sleep(1000)

  // TODO: check!
  // rawRes = await fetch('/')
  // res = await $fetch('/')
  // console.log(res)
  expect(ctx.server).toBeUndefined()
  expect(ctx.port).toBeUndefined()
})
