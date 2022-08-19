# Testing for server

If your vite application has server (e.g.[svelte-kit](https://kit.svelte.dev/)), you can test the server using the helper API.

To test in a server, you need specify `server: true` in `setup`, and then it using the several helper APIs.

## Endpoint testing

The following is a test of svelte-kit endpoints:

```ts
import { setup, $fetch } from 'vite-test-utils'

await setup({
  server: true
})

test('create a todo', async () => {
  const form = new FormData()
  form.append('text', 'task1')
  // make a request to server from testing side using a helper API like fetch API
  const { todo } = await $fetch('/todos', {
    method: 'POST',
    body: form,
    headers: {
      accept: 'application/json'
    }
  })

  expect(todo).toHaveProperty('uid')
  expect(todo).toHaveProperty('created_at')
  expect(todo).toContain({ text: 'task1', done: false })
})
```

If `server: true` is specified, vite test utils will automatically launch a vite server to host your vite application.

Vite test utils provide `$fetch` similar to the fetch API. it's more user-friendly than the fetch API. See here for more details.

## Launch the server manually

TODO:
