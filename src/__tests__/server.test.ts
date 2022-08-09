import { fileURLToPath } from 'node:url'
import { createTestContext } from '../context'
import { prepareFixture } from '../vite'
import { startServer, stopServer, url, $fetch, fetch } from '../server'
import { sleep } from './helper'

const __dirname = fileURLToPath(new URL(`./fixtures/server`, import.meta.url))

test('dev server', async () => {
  const ctx = createTestContext({
    fixtureDir: __dirname
  })
  await prepareFixture()

  await startServer()
  await sleep(1000)
  assert(ctx.url?.startsWith(`http://127.0.0.1:${ctx.port}`))
  assert(ctx.server != null)

  expect(url('/foo')).toBe(`http://127.0.0.1:${ctx.port}/foo`)

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
  expect(ctx.server).toBeUndefined()
  expect(ctx.port).toBeUndefined()
})

test('preview server', async () => {
  const ctx = createTestContext({
    fixtureDir: __dirname,
    mode: 'preview'
  })
  await prepareFixture()

  await startServer()
  await sleep(1000)
  assert(ctx.url?.startsWith(`http://127.0.0.1:${ctx.port}`))
  assert(ctx.server != null)

  expect(url('/foo')).toBe(`http://127.0.0.1:${ctx.port}/foo`)

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
  expect(ctx.server).toBeUndefined()
  expect(ctx.port).toBeUndefined()
})
