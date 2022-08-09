import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    {
      input: 'src/index',
      outDir: './dist',
      declaration: true
    },
    {
      input: 'src/process',
      outDir: './dist',
      declaration: true
    }
  ],
  replace: {
    __BUILD__: JSON.stringify(true)
  },
  rollup: {
    emitCJS: true
  },
  externals: ['vitest', 'playwright', 'playwright-core']
})
