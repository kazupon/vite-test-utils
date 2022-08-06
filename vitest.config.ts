import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    exclude: [...configDefaults.exclude, 'playground']
  }
})
