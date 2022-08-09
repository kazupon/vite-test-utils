import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  define: {
    __BUILD__: JSON.stringify(false)
  },
  test: {
    globals: true,
    clearMocks: true,
    exclude: [...configDefaults.exclude, 'playground']
  }
})
