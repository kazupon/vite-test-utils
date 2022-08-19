import { setup, $fetch } from 'vite-test-utils'
import { serialize } from 'cookie'
import { FormData } from 'formdata-polyfill/esm.min.js'

type ToDo = {
  uid: string
  text: string
  done: boolean
  guestid?: string
  create_at: string
}

await setup({
  server: true
})

async function getTodos(userId: string): Promise<ToDo[]> {
  const { todos } = await $fetch('/todos', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      cookie: serialize('userid', userId)
    }
  })
  return todos as ToDo[]
}

test('CRUD', async () => {
  // create a todo
  const postForm = new FormData()
  postForm.append('text', 'task1')
  const postResponse = await $fetch('/todos', {
    method: 'POST',
    body: postForm,
    headers: {
      accept: 'application/json'
    }
  })
  let todo = (postResponse as any).todo as ToDo
  expect(todo).toHaveProperty('uid')
  expect(todo).toHaveProperty('created_at')
  expect(todo).toContain({ text: 'task1', done: false })

  const userId = todo.guestid

  // fetch the todos
  let todos = await getTodos(userId)
  expect(todos[0]).toContain({ text: 'task1', done: false, uid: todo.uid })

  // update todo
  const patchForm = new FormData()
  patchForm.append('uid', todo.uid)
  patchForm.append('done', 'true')
  await $fetch('/todos', {
    method: 'PATCH',
    body: patchForm,
    headers: {
      cookie: serialize('userid', userId)
    }
  })

  // delete todo
  const deleteForm = new FormData()
  deleteForm.append('uid', todo.uid)
  await $fetch('/todos', {
    method: 'DELETE',
    body: deleteForm,
    headers: {
      cookie: serialize('userid', userId)
    }
  })

  // fetch the todos again!
  todos = await getTodos(userId)
  expect(todos.length).toBe(0)
})
