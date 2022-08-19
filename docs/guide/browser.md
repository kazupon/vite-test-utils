# Testing for browser

Under the hood, Vite test utils uses [`playwright`](https://playwright.dev/) to do browser testing.

To test in a browser, you need specify `browser: true` in `setup`, and then it using the `createPage` helper API.

## Basic usage

The following test tests the root (index) page of vite application rendered by playwright:

```ts
import { setup, createPage } from 'vite-test-utils'

await setup({
  browser: true
})

test('render the index page', async () => {
  // create a page instance of `playwright` via `createPage` helper API.
  const page = await createPage('/')
  const html = await page.innerHTML('body')

  expect(html).toContain('Something')
})
```

If `browser: true` is specified, vite test utils will automatically launch a vite server to host your vite application.

The host name that is working in test are resolved in the [`server.host`](https://vitejs.dev/config/server-options.html#server-host) or [`preview.host`](https://vitejs.dev/config/preview-options.html#preview-host) by vite.

::: tip
By default, the vite dev server is launched. If you want to test your vite application closer to the production environment, specify `mode: 'preview'` to `setup`. Then vite test utils will build your vite application and launch the vite preview server to run the tests.
:::

## Navigation by resolved URL

we sometime test in the browser with page navigation. At that time, playwright requires the full URL.

vite test util provide `url` helper API. we can resolve the navigation URL with using it. the following the example:

```ts
import { setup, createPage, url } from 'vite-test-utils'

await setup({
  browser: true
})

test('naviate to about page', async () => {
  const page = await createPage('/')
  // resolve as `http://xxx:about` fully URL via `url` helper API
  await page.goto(url('/profile'))
  expect(await page.textContent('body')).toBe('This is an profile page')

  const aboutLink = await page.locator('nav a[href="/about"]')
  await aboutLink.click()

  const about = await page.locator('.about h1')
  expect(await about.textContent()).toBe('This is an about page')
})
```
