import { setup, createPage, url } from 'vite-test-utils'

await setup()

test('pages', async () => {
  const page = await createPage()
  await page.goto(url('/'))

  page.on('console', (...args) => console.log(...args))

  const aboutLink = await page.locator('nav a[href="/about"]')
  await aboutLink.click()
  const about = await page.locator('.about h1')
  expect(await about.textContent()).toBe('This is an about page')
})
