import { setup, createPage } from 'vite-test-utils'

await setup()

test('counting', async () => {
  const page = await createPage('/')

  const button = await page.locator('#counter')
  await button.click()
  await button.click()
  await button.click()

  expect(await button.innerText()).toBe('count is 3')
})
