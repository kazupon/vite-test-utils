import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    deps: {
      inline: [/vite-test-utils/]
    }
  }
})
