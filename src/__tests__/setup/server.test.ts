import { setup } from '../../setup'
import { createPage } from '../../browser'
import { url, startServer } from '../../server'
import { fileURLToPath } from 'node:url'

await setup({
  rootDir: fileURLToPath(new URL(`../fixtures/server`, import.meta.url)),
  server: true,
  browser: true
})

test('manually server control', async () => {
  await startServer()

  const page = await createPage()
  await page.goto(url('/'))
  expect(await page.content()).toContain(`<title>Vite + TS</title>`)
})
