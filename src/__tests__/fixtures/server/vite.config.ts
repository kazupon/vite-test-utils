import { defineConfig } from 'vite'
import MyPlugin from './plugin'

export default defineConfig({
  plugins: [MyPlugin()]
})
