import { setup, createPage, url } from 'vite-test-utils'

await setup()

test('counting', async () => {
  const page = await createPage()
  await page.goto(url('/'))
  expect(await page.content()).toContain(`<title>Vite + TS</title>`)
})
