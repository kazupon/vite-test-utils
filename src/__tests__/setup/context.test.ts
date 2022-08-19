import { setup } from '../../setup'
import { fileURLToPath } from 'node:url'

await setup({
  rootDir: fileURLToPath(new URL(`../fixtures/server`, import.meta.url)),
  server: true,
  browser: true
})

test('basic', async ({ utils: { createPage, url } }) => {
  const page = await createPage()
  await page.goto(url('/'))
  expect(await page.content()).toContain(`<title>Vite + TS</title>`)
})
