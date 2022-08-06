import { defineConfig } from 'vite'
import MyPlugin from './plugin'

export default defineConfig({
  define: {
    'import.meta.foo': process.env.NODE_ENV === 'production' ? 'bar' : 'baz',
    'import.meta.bar': () => JSON.stringify({ foo: 1 })
  },
  plugins: [MyPlugin()]
})
