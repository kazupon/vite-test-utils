import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    {
      input: 'src/index',
      outDir: './dist',
      declaration: true
    }
  ],
  rollup: {
    emitCJS: true
  },
  externals: ['vitest', 'playwright', 'playwright-core']
})
