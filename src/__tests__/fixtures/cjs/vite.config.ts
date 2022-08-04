import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.VITE_TEST_UTILS': 'test'
  },
  plugins: [
    {
      name: 'my-plugin',
      transform(code, id) {
        return code
      }
    }
  ]
})
