import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 10000,
    globals: true,
    deps: {
      inline: [/vite-test-utils/]
    }
  }
})
