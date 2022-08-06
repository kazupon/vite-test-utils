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
  assert(ctx.url?.startsWith(`http://localhost:${ctx.port}`))

  expect(url('/foo')).toBe(`http://localhost:${ctx.port}/foo`)

  const rawRes = await fetch('/')
  expect(rawRes.status).toBe(200)

  const res = await $fetch('/')
  expect(res).toContain(`<title>Vite + TS</title>`)

  await stopServer()
  await sleep(1000)

  let closed = false
  try {
    await fetch('/')
  } catch {
    closed = true
  }
  expect(closed).toBe(true)
})
