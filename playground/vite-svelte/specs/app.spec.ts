import { setup, createPage } from 'vite-test-utils'

await setup()

test('count', async () => {
  const page = await createPage('/')

  const button = await page.locator('button[aria-label="Increase the counter by one"]')
  await button.focus()
  await page.waitForTimeout(1000)
  await button.click()
  await page.waitForTimeout(500)
  await button.click()
  await page.waitForTimeout(500)
  await button.click()
  await page.waitForTimeout(500)

  const count = await page.locator('.counter strong >> nth=-1')
  expect(await count.textContent()).toBe('3')
})
