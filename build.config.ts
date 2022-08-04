import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    {
      input: 'src/index.ts',
      outDir: './dist',
      declaration: true
    }
  ],
  rollup: {
    emitCJS: true
  },
  externals: ['playwright', 'playwright-core']
})
