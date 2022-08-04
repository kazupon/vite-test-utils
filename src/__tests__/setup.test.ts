import { setup } from '../setup'
import { createPage } from '../browser'
import { url } from '../server'
import { fileURLToPath } from 'node:url'

await setup({
  rootDir: fileURLToPath(new URL(`./fixtures/server`, import.meta.url))
})

test('basic', async () => {
  const page = await createPage()
  await page.goto(url('/'))
  expect(await page.content()).toContain(`<title>Vite + TS</title>`)
})
