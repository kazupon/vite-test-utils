import { setup } from '../setup'
import { createPage } from '../browser'
import { url } from '../server'
import { fileURLToPath } from 'node:url'

await setup({
  rootDir: fileURLToPath(new URL(`./fixtures/server`, import.meta.url))
})

test.skip('basic', async () => {
  const page = await createPage()
  await page.goto(url('/'))
  console.log(await page.content())
})
