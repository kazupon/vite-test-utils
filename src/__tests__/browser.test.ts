import { createTestContext } from '../context'
import { createBrowser, createPage } from '../browser'

describe('createBrowser', () => {
  test('basic', async () => {
    const ctx = createTestContext({
      browser: true,
      browserOptions: {
        type: 'chromium'
      }
    })
    await createBrowser()
    expect(ctx.browser).toBeDefined()
  })

  test('invalid browser', async () => {
    createTestContext({
      browser: true,
      browserOptions: {
        type: 'foo' as 'chromium'
      }
    })
    let err: Error
    try {
      await createBrowser()
    } catch (e) {
      err = e as Error
    }
    expect(err!.message).toBe("Invalid browser 'foo'")
  })
})

describe('createPage', () => {
  test('basic', async () => {
    createTestContext({
      browser: true
    })
    const page = await createPage()
    expect(page).toBeDefined()
  })
})
