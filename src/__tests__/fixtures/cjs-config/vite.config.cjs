const { defineConfig } = require('vite')

module.exports = defineConfig({
  define: {
    'process.env.VITE_TEST_UTILS': 'test'
  },
  plugins: [
    {
      name: 'my-plugin',
      transform: (code, id) => {
        return code
      }
    }
  ]
})
