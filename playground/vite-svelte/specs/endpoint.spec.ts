import { setup, fetch } from 'vite-test-utils'
import { serialize } from 'cookie'
import { FormData } from 'formdata-polyfill/esm.min.js'

type ToDo = {
  uid: string
  text: string
  done: boolean
  guestid?: string
  create_at: string
}

await setup()

async function getTodos(userId: string): Promise<ToDo[]> {
  const res = await fetch('/todos', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      cookie: serialize('userid', userId)
    }
  })
  const { todos } = await res.json()
  return todos as ToDo[]
}

test('CRUD', async () => {
  // create a todo
  const postForm = new FormData()
  postForm.append('text', 'task1')
  const postResponse = await fetch('/todos', {
    method: 'POST',
    body: postForm,
    headers: {
      accept: 'application/json'
    }
  })
  const { todo } = await postResponse.json()
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
  const patchResponse = await fetch('/todos', {
    method: 'PATCH',
    body: patchForm,
    headers: {
      cookie: serialize('userid', userId)
    }
  })
  expect(patchResponse.status).toBe(200)

  // delete todo
  const deleteForm = new FormData()
  deleteForm.append('uid', todo.uid)
  const deleteResponse = await fetch('/todos', {
    method: 'DELETE',
    body: deleteForm,
    headers: {
      cookie: serialize('userid', userId)
    }
  })
  expect(deleteResponse.status).toBe(200)

  // fetch the todos again!
  todos = await getTodos(userId)
  expect(todos.length).toBe(0)
})
